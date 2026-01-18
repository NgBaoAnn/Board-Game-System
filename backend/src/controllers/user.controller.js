const HTTP_STATUS = require("../constants/http-status");
const userService = require("../services/user.service");
const ResponseHandler = require("../utils/response-handler");

class UserController {
  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.CREATED,
        message: "Create user successfully!",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      const id = req.params.id;
      const payload = { ...req.body, id };
      const response = await userService.updateUser(payload);
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Update user successfully!",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async getUser(req, res, next) {
    try {
      const id = req.params.id;
      const response = await userService.getUser(id);
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: `Get user successfully!`,
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const { page, limit, search, role, active } = req.query;

      const response = await userService.getAllUser({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        search,
        role,
        active,
      });
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: `Get list users successfully!`,
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const id = req.params.id;
      const response = await userService.deleteUser(id);
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Delete user successfully!",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async getUserCounts(req, res, next) {
    try {
      const response = await userService.getUserCounts();
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Get user counts successfully!",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async getUserRegistrations(req, res, next) {
    try {
      const response = await userService.getUserRegistrations();
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Get user registrations successfully!",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async getUserStats(req, res, next) {
    try {
      const userId = req.params.id;
      const response = await userService.getUserStats(userId);
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Get user stats successfully!",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
