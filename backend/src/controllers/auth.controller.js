const HTTP_STATUS = require("../constants/http-status");
const authService = require("../services/auth.service");
const ResponseHandler = require("../utils/response-handler");

class AuthController {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.CREATED,
        message: "Register successfully!",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const response = await authService.login(req.body);
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Login successfully!",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
