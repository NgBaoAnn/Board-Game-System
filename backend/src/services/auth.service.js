const passwordService = require("./password.service");
const jwtService = require("./jwt.service");
const emailService = require("./email.service");
const userRepo = require("../repositories/user.repo");
const sanitizeUser = require("../utils/sanitize-user");
const NotFoundError = require("../errors/notfound.exception");
const ForbiddenError = require("../errors/forbidden.exception");
const DuplicateError = require("../errors/duplicate.exception");
const UnauthorizedError = require("../errors/unauthorized.exception");

class AuthService {
  async register({ email, password, username }) {
    const existing = await userRepo.findByEmail(email);
    if (existing) {
      throw new DuplicateError("Email already exists");
    }

    const hashedPassword = await passwordService.hash(password);

    const user = await userRepo.create({
      role_id: 2,
      username,
      email,
      password: hashedPassword,
    });

    return sanitizeUser(user);
  }

  async login({ email, password }) {
    const user = await userRepo.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isMatch = await passwordService.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const accessToken = jwtService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role.name,
    });

    const refreshToken = jwtService.generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role.name,
    });

    return {
      user: sanitizeUser(user),
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async logout(id) {
    const user = await userRepo.findById(id);
    if (!user) {
      throw new NotFoundError("User not found!");
    }
    return null;
  }

  async account(id) {
    const user = await userRepo.findById(id);
    if (!user) {
      throw new NotFoundError("User not found!");
    }
    return user;
  }

  async refreshToken(refreshToken) {
    const decoded = jwtService.verify(refreshToken);

    const user = await userRepo.findById(decoded.id);

    if (!user || !user.active) {
      throw new ForbiddenError("Your account is blocked or unavailable now!");
    }

    const newAccessToken = jwtService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role.name,
    });

    return {
      access_token: newAccessToken,
    };
  }

  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  generateResetToken() {
    const crypto = require("crypto");
    return crypto.randomBytes(32).toString("hex");
  }

  async forgotPassword(email) {
    const user = await userRepo.findByEmail(email);
    if (!user) {
      throw new NotFoundError("Email not found");
    }

    const otp = this.generateOtp();

    await userRepo.saveResetOtp(user.id, otp); // uses PostgreSQL NOW() + 5 minutes

    await emailService.sendResetPasswordOtp(email, otp);

    return {
      message: "OTP sent to your email",
    };
  }

  async verifyOtp(email, otp) {
    const db = require("../databases/knex");
    const dbUser = await db("users")
      .where({ email })
      .select("email", "reset_otp", "reset_otp_expires_at")
      .first();

    const user = await userRepo.findByResetOtp(email, otp);
    if (!user) {
      throw new UnauthorizedError("Invalid or expired OTP");
    }

    const resetToken = this.generateResetToken();

    await userRepo.saveResetToken(user.id, resetToken); // uses PostgreSQL NOW() + 15 minutes

    return {
      message: "OTP verified successfully",
      reset_token: resetToken,
    };
  }

  async resetPassword(resetToken, newPassword) {
    const user = await userRepo.findByResetToken(resetToken);
    if (!user) {
      throw new UnauthorizedError("Invalid or expired reset token");
    }

    const hashedPassword = await passwordService.hash(newPassword);
    await userRepo.updatePassword(user.id, hashedPassword);

    return {
      message: "Password reset successfully",
    };
  }
}

module.exports = new AuthService();
