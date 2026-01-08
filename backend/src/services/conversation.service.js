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

  async sendMessage({ userId, conversationId, content }) {
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
}

module.exports = new ConversationService();
