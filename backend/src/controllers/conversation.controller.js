const HTTP_STATUS = require("../constants/http-status");
const ResponseHandler = require("../utils/response-handler");
const conversationService = require("../services/conversation.service");
const uploadService = require("../services/upload.service");

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

  async getOrCreateConversation(req, res, next) {
    try {
      const userId = req.user.id;
      const { targetUserId } = req.body;

      const response = await conversationService.getOrCreateConversation({
        userId,
        targetUserId,
      });

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Conversation retrieved successfully!",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async sendMessage(req, res, next) {
    try {
      const userId = req.user.id;
      const conversationId = req.params.id;
      const { content } = req.body;

      // Handle file upload if present
      let fileData = {};
      if (req.file) {
        const uploadResult = await uploadService.uploadMessageAttachment(req.file);
        fileData = {
          fileUrl: uploadResult.url,
          fileName: uploadResult.fileName,
          fileType: uploadResult.fileType,
          fileSize: uploadResult.fileSize,
        };
      }

      const response = await conversationService.sendMessage({
        userId,
        conversationId,
        content: content || '',
        ...fileData,
      });

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.CREATED,
        message: "Message sent successfully!",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async getMessages(req, res, next) {
    try {
      const userId = req.user.id;
      const conversationId = req.params.id;
      const { page = 1, limit = 50 } = req.query;

      const response = await conversationService.getMessages({
        userId,
        conversationId,
        page: Number(page),
        limit: Number(limit),
      });

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Get messages successfully!",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteConversation(req, res, next) {
    try {
      const userId = req.user.id;
      const conversationId = req.params.id;

      await conversationService.deleteConversation({
        userId,
        conversationId,
      });

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Delete conversation successfully!",
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }

  async reactToMessage(req, res, next) {
    try {
      const userId = req.user.id;
      const messageId = req.params.messageId;
      const { reaction } = req.body;

      const response = await conversationService.reactToMessage({
        userId,
        messageId,
        reaction,
      });

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Reaction updated successfully!",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const userId = req.user.id;
      const conversationId = req.params.id;

      const response = await conversationService.markAsRead({
        userId,
        conversationId,
      });

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Messages marked as read!",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async getUnreadCount(req, res, next) {
    try {
      const userId = req.user.id;

      const response = await conversationService.getUnreadCount(userId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Unread count retrieved!",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ConversationController();
