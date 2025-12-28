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
}

module.exports = new ConversationService();
