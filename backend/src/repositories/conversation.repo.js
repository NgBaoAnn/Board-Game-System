const db = require("../databases/knex");
const MODULE = require("../constants/module");

class ConversationRepo {
  getConversations({ userId, offset = 0, limit = 10 }) {
    return db({ c: MODULE.CONVERSATION })
      .join({ u: MODULE.USER }, function () {
        this.on(
          "u.id",
          "=",
          db.raw(
            `
            CASE
              WHEN c.user_a = ? THEN c.user_b
              ELSE c.user_a
            END
          `,
            [userId]
          )
        );
      })
      .where(function () {
        this.where("c.user_a", userId).orWhere("c.user_b", userId);
      })
      .select(
        "c.id as conversation_id",
        "u.id as user_id",
        "u.username",
        "u.avatar_url",
        "c.updated_at"
      )
      .orderBy("c.updated_at", "desc")
      .limit(limit)
      .offset(offset);
  }

  countConversations(userId) {
    return db(MODULE.CONVERSATION)
      .where(function () {
        this.where("user_a", userId).orWhere("user_b", userId);
      })
      .count("* as total")
      .first();
  }

  findById(conversationId) {
    return db({ c: MODULE.CONVERSATION })
      .leftJoin({ ua: MODULE.USER }, "c.user_a", "ua.id")
      .leftJoin({ ub: MODULE.USER }, "c.user_b", "ub.id")
      .select(
        "c.id",
        "c.created_at",
        "c.updated_at",
        db.raw(`
        json_build_object(
          'id', ua.id,
          'username', ua.username,
          'avatar_url', ua.avatar_url
        ) as user_a
      `),
        db.raw(`
        json_build_object(
          'id', ub.id,
          'username', ub.username,
          'avatar_url', ub.avatar_url
        ) as user_b
      `)
      )
      .where("c.id", conversationId)
      .first();
  }

  findByUsers(userA, userB) {
    return db(MODULE.CONVERSATION)
      .where(function () {
        this.where({ user_a: userA, user_b: userB }).orWhere({
          user_a: userB,
          user_b: userA,
        });
      })
      .first();
  }

  create({ userA, userB }) {
    return db(MODULE.CONVERSATION)
      .insert({
        id: db.raw("uuid_generate_v4()"),
        user_a: userA,
        user_b: userB,
      })
      .returning("*")
      .then(([row]) => row);
  }

  updateTimestamp(conversationId) {
    return db(MODULE.CONVERSATION)
      .where("id", conversationId)
      .update({ updated_at: db.fn.now() });
  }

  createMessage({ senderId, conversationId, content, fileUrl, fileName, fileType, fileSize }) {
    return db(MODULE.MESSAGE)
      .insert({
        sender_id: senderId,
        conversation_id: conversationId,
        content,
        file_url: fileUrl || null,
        file_name: fileName || null,
        file_type: fileType || null,
        file_size: fileSize || null,
      })
      .returning("*")
      .then(([row]) => row);
  }

  getMessages({ conversationId, offset = 0, limit = 50 }) {
    return db(MODULE.MESSAGE)
      .select(
        "messages.id",
        "messages.content",
        "messages.reaction",
        "messages.file_url",
        "messages.file_name",
        "messages.file_type",
        "messages.file_size",
        "messages.created_at",
        "messages.sender_id",
        "users.username as sender_username",
        "users.avatar_url as sender_avatar"
      )
      .leftJoin("users", "messages.sender_id", "users.id")
      .where("messages.conversation_id", conversationId)
      .orderBy("messages.created_at", "desc")
      .limit(limit)
      .offset(offset);
  }

  countMessages(conversationId) {
    return db(MODULE.MESSAGE)
      .where("conversation_id", conversationId)
      .count("* as total")
      .first();
  }

  async delete(conversationId) {
    // Delete all messages first (due to foreign key constraint)
    await db(MODULE.MESSAGE).where("conversation_id", conversationId).del();
    // Delete the conversation
    return db(MODULE.CONVERSATION).where("id", conversationId).del();
  }

  findMessageById(messageId) {
    return db(MODULE.MESSAGE)
      .where("id", messageId)
      .first();
  }

  reactToMessage({ messageId, reaction }) {
    return db(MODULE.MESSAGE)
      .where("id", messageId)
      .update({ reaction })
      .returning("*")
      .then(([row]) => row);
  }
}

module.exports = new ConversationRepo();
