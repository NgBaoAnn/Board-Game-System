const HTTP_STATUS = require("../constants/http-status");
const ResponseHandler = require("../utils/response-handler");
const conversationService = require("../services/conversation.service");

class ConversationController {
  async getConversationUser(req, res, next) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const response = await conversationService.getConversationUser({
        userId,
        page: Number(page),
        limit: Number(limit),
      });

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Get conversations successfully!",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async getDetailConversation(req, res, next) {
    try {
      const userId = req.user.id;
      const conversationId = req.params.id;

      const response = await conversationService.getDetailConversation({
        userId,
        conversationId,
      });

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Get conversation detail successfully!",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ConversationController();
