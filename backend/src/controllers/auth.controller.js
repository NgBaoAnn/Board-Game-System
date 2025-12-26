const cookieConfig = require("../configs/cookie.config");
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

      res.cookie("refresh_token", response.refresh_token, cookieConfig.config);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Login successfully!",
        data: {
          access_token: response.access_token,
          user: response.user,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const id = req.user.id;
      const response = await authService.logout(id);

      res.clearCookie("refresh_token");

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.NO_CONTENT,
        message: "Log out successfully!",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async account(req, res, next) {
    try {
      const id = req.user.id;
      const response = await authService.account(id);
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Fetch account successfully!",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const refreshToken = req.cookies.refresh_token;
      const response = await authService.refreshToken(refreshToken);
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Refresh token successfully!",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
