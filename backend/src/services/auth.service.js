const passwordService = require("./password.service");
const jwtService = require("./jwt.service");
const DuplicateError = require("../errors/duplicate.exception");
const UnauthorizedError = require("../errors/unauthorized.exception");
const sanitizeUser = require("../utils/sanitize-user");
const userRepo = require("../repositories/user.repo");
const NotFoundError = require("../errors/notfound.exception");
const ForbiddenError = require("../errors/forbidden.exception");
const { decode } = require("jsonwebtoken");

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
    console.log(user);

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
}

module.exports = new AuthService();
