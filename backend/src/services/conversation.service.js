const NotFoundError = require("../errors/notfound.exception");
const ForbiddenError = require("../errors/forbidden.exception");
const conversationRepo = require("../repositories/conversation.repo");

class ConversationService {
  async getConversationUser({ userId, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;

    const [conversations, total] = await Promise.all([
      conversationRepo.getConversations({ userId, offset, limit }),
      conversationRepo.countConversations(userId),
    ]);

    return {
      data: conversations,
      pagination: {
        page,
        limit,
        total: Number(total.total),
      },
    };
  }

  async getDetailConversation({ userId, conversationId }) {
    const conversation = await conversationRepo.findById(conversationId);
    if (!conversation) {
      throw new NotFoundError("Conversation not found!");
    }

    if (
      conversation.user_a.id !== userId &&
      conversation.user_b.id !== userId
    ) {
      throw new ForbiddenError(
        "You are not allowed to access this conversation!"
      );
    }

    return conversation;
  }

  async getOrCreateConversation({ userId, targetUserId }) {
    if (userId === targetUserId) {
      throw new ForbiddenError("Cannot create conversation with yourself!");
    }

    let conversation = await conversationRepo.findByUsers(userId, targetUserId);

    if (!conversation) {
      conversation = await conversationRepo.create({
        userA: userId,
        userB: targetUserId,
      });
    }

    return conversationRepo.findById(conversation.id);
  }

  async sendMessage({ userId, conversationId, content, fileUrl, fileName, fileType, fileSize }) {
    const conversation = await conversationRepo.findById(conversationId);
    if (!conversation) {
      throw new NotFoundError("Conversation not found!");
    }

    if (
      conversation.user_a.id !== userId &&
      conversation.user_b.id !== userId
    ) {
      throw new ForbiddenError(
        "You are not allowed to send message to this conversation!"
      );
    }

    const message = await conversationRepo.createMessage({
      senderId: userId,
      conversationId,
      content,
      fileUrl,
      fileName,
      fileType,
      fileSize,
    });

    await conversationRepo.updateTimestamp(conversationId);

    return message;
  }

  async getMessages({ userId, conversationId, page = 1, limit = 50 }) {
    const conversation = await conversationRepo.findById(conversationId);
    if (!conversation) {
      throw new NotFoundError("Conversation not found!");
    }

    if (
      conversation.user_a.id !== userId &&
      conversation.user_b.id !== userId
    ) {
      throw new ForbiddenError(
        "You are not allowed to access this conversation!"
      );
    }

    const offset = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      conversationRepo.getMessages({ conversationId, offset, limit }),
      conversationRepo.countMessages(conversationId),
    ]);

    return {
      data: messages,
      pagination: {
        page,
        limit,
        total: Number(total.total),
      },
    };
  }

  async deleteConversation({ userId, conversationId }) {
    const conversation = await conversationRepo.findById(conversationId);
    if (!conversation) {
      throw new NotFoundError("Conversation not found!");
    }

    if (
      conversation.user_a.id !== userId &&
      conversation.user_b.id !== userId
    ) {
      throw new ForbiddenError(
        "You are not allowed to delete this conversation!"
      );
    }

    await conversationRepo.delete(conversationId);
    return true;
  }

  async reactToMessage({ userId, messageId, reaction }) {
    // Find the message
    const message = await conversationRepo.findMessageById(messageId);
    if (!message) {
      throw new NotFoundError("Message not found!");
    }

    // Verify user belongs to this conversation
    const conversation = await conversationRepo.findById(message.conversation_id);
    if (!conversation) {
      throw new NotFoundError("Conversation not found!");
    }

    if (
      conversation.user_a.id !== userId &&
      conversation.user_b.id !== userId
    ) {
      throw new ForbiddenError(
        "You are not allowed to react to this message!"
      );
    }

    // Update the reaction (null to remove, emoji to add)
    const updatedMessage = await conversationRepo.reactToMessage({
      messageId,
      reaction: reaction || null,
    });

    return updatedMessage;
  }
}

module.exports = new ConversationService();
