const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/unauthorized.exception");

const jwtConfig = require("../configs/jwt.config");

class JwtService {
  generateAccessToken(payload) {
    return jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.accessExpiresIn,
    });
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.refreshExpiresIn,
    });
  }

  verify(token) {
    try {
      return jwt.verify(token, jwtConfig.secret);
    } catch (err) {
      throw new UnauthorizedError("Invalid or expired token");
    }
  }
}

module.exports = new JwtService();
