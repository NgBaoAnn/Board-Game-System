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

  findByUsers(userA, userB, trx = db) {
    return trx(MODULE.CONVERSATION)
      .where({ user_a: userA, user_b: userB })
      .first();
  }

  create({ userA, userB }, trx = db) {
    return trx(MODULE.CONVERSATION)
      .insert({
        user_a: userA,
        user_b: userB,
      })
      .returning("*")
      .then(([row]) => row);
  }
}

module.exports = new ConversationRepo();
