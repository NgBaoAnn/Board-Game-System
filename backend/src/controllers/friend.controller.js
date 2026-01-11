const HTTP_STATUS = require("../constants/http-status");
const friendService = require("../services/friend.service");
const ResponseHandler = require("../utils/response-handler");

class FriendController {
  async sendRequest(req, res, next) {
    try {
      const from = req.user.id;
      const { to, message } = req.body;
      const response = await friendService.sendRequest({
        from: from,
        to,
        message,
      });
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.CREATED,
        message: response.message,
      });
    } catch (err) {
      next(err);
    }
  }

  async getReceivedRequests(req, res, next) {
    try {
      const userId = req.user.id;
      const { page, limit } = req.query;
      const response = await friendService.getReceivedRequests({
        userId,
        page,
        limit,
      });
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Get received request successfully!",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async getSentRequests(req, res, next) {
    try {
      const userId = req.user.id;
      const { page, limit } = req.query;
      const response = await friendService.getSentRequests({
        userId,
        page,
        limit,
      });
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Get sent request successfully!",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async acceptRequest(req, res, next) {
    try {
      const userId = req.user.id;
      const requestId = req.params.id;
      await friendService.acceptRequest({ userId, requestId });
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Accepted request successfully!",
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }

  async declineRequest(req, res, next) {
    try {
      const userId = req.user.id;
      const requestId = req.params.id;
      await friendService.declineRequest({
        userId,
        requestId,
      });
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Declined request successfully!",
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }

  async getFriends(req, res, next) {
    try {
      const userId = req.user.id;
      const { page, limit } = req.query;
      const response = await friendService.getFriends({ userId, page, limit });
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Get friends successfully!",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async removeFriend(req, res, next) {
    try {
      const userId = req.user.id;
      const friendId = req.params.friendId;
      await friendService.removeFriend({
        userId,
        friendId,
      });
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Removed friend successfully!",
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }

  async getNonFriends(req, res, next) {
    try {
      const userId = req.user.id;
      const { page, limit, search } = req.query;
      const response = await friendService.getNonFriends({
        userId,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        search: search || '',
      });
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Get non-friends successfully!",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new FriendController();
