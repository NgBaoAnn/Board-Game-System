const db = require("../databases/knex");
const MODULE = require("../constants/module");

class FriendRepo {
  findFriendPair(userA, userB) {
    return db(MODULE.FRIEND)
      .where({
        user_a: userA,
        user_b: userB,
      })
      .first();
  }

  findExistingRequest(from, to) {
    return db(MODULE.FRIEND_REQUEST)
      .where(function () {
        this.where({ from, to }).orWhere({ from: to, to: from });
      })
      .first();
  }

  findRequestById(requestId) {
    return db(MODULE.FRIEND_REQUEST).where({ id: requestId }).first();
  }

  async createRequest(data) {
    const [request] = await db(MODULE.FRIEND_REQUEST)
      .insert(data)
      .returning("*");

    return request;
  }

  getReceivedRequests({ userId, offset = 0, limit = 10 }) {
    return db(MODULE.FRIEND_REQUEST)
      .where({ to: userId })
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);
  }
  countReceivedRequests(userId) {
    return db(MODULE.FRIEND_REQUEST)
      .where({ to: userId })
      .count("* as total")
      .first();
  }

  getSentRequests({ userId, offset = 0, limit = 10 }) {
    return db(MODULE.FRIEND_REQUEST)
      .where({ from: userId })
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);
  }
  countSentRequests(userId) {
    return db(MODULE.FRIEND_REQUEST)
      .where({ from: userId })
      .count("* as total")
      .first();
  }

  async acceptRequest({ requestId, userA, userB }) {
    return db.transaction(async (trx) => {
      await trx(MODULE.FRIEND).insert({
        user_a: userA,
        user_b: userB,
        status: "ACCEPTED",
      });

      await trx(MODULE.FRIEND_REQUEST).where({ id: requestId }).del();
    });
  }

  removeRequest(requestId) {
    return db(MODULE.FRIEND_REQUEST).where({ id: requestId }).del();
  }

  getFriends({ userId, offset = 0, limit = 10 }) {
    return db({ f: MODULE.FRIEND })
      .join({ u: MODULE.USER }, function () {
        this.on("u.id", "=", "f.user_a").orOn("u.id", "=", "f.user_b");
      })
      .where("f.status", "ACCEPTED")
      .whereRaw("(f.user_a = ? OR f.user_b = ?)", [userId, userId])
      .whereRaw("u.id <> ?", [userId])
      .select("u.id", "u.username", "u.email", "u.avatar_url", "f.created_at")
      .orderBy("f.created_at", "desc")
      .limit(limit)
      .offset(offset);
  }
  countFriends(userId) {
    return db(MODULE.FRIEND)
      .where("status", "ACCEPTED")
      .andWhere(function () {
        this.where("user_a", userId).orWhere("user_b", userId);
      })
      .count("* as total")
      .first();
  }

  removeFriend(userA, userB) {
    return db(MODULE.FRIEND).where({ user_a: userA, user_b: userB }).del();
  }
}

module.exports = new FriendRepo();
