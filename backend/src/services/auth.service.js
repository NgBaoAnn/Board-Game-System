const passwordService = require("./password.service");
const jwtService = require("./jwt.service");
const DuplicateError = require("../errors/duplicate.exception");
const UnauthorizedError = require("../errors/unauthorized.exception");
const sanitizeUser = require("../utils/sanitize-user");
const userRepo = require("../repositories/user.repo");

class AuthService {
  async register({ email, password, username }) {
    const existing = await userRepo.findByEmail(email);
    if (existing) {
      throw new DuplicateError("Email already exists");
    }

    const hashedPassword = await passwordService.hash(password);

    const [user] = await userRepo.create({
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
    });

    const refreshToken = jwtService.generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    return {
      user: sanitizeUser(user),
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}

module.exports = new AuthService();
