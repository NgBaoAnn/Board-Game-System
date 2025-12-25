const jwtService = require("../services/jwt.service");
const UnauthorizedError = require("../errors/unauthorized.exception");
const ForbiddenError = require("../errors/forbidden.exception");

class AuthMiddleware {
  authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        new UnauthorizedError("Missing or invalid Authorization header")
      );
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwtService.verify(token);
      req.user = decoded;
      next();
    } catch (err) {
      next(err);
    }
  }

  authorize(roles = []) {
    return (req, res, next) => {
      if (!roles.length || roles.includes(req.user.role)) {
        return next();
      }
      next(new ForbiddenError());
    };
  }
}

module.exports = new AuthMiddleware();
