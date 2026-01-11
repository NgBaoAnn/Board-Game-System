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

  async getAllFriendIds(userId) {
    const friends = await db(MODULE.FRIEND)
      .where("status", "ACCEPTED")
      .andWhere(function () {
        this.where("user_a", userId).orWhere("user_b", userId);
      })
      .select("user_a", "user_b");

    return friends.map((f) => (f.user_a === userId ? f.user_b : f.user_a));
  }

  removeFriend(userA, userB) {
    return db(MODULE.FRIEND).where({ user_a: userA, user_b: userB }).del();
  }

  async getNonFriends({ userId, offset = 0, limit = 10, search = '' }) {
    // Get all friend IDs
    const friendIds = await this.getAllFriendIds(userId);
    
    // Get all pending request user IDs (both sent and received)
    const pendingRequests = await db(MODULE.FRIEND_REQUEST)
      .where('from', userId)
      .orWhere('to', userId)
      .select('from', 'to');
    
    const pendingUserIds = pendingRequests.flatMap(r => 
      r.from === userId ? [r.to] : [r.from]
    );
    
    // Combine excluded IDs
    const excludedIds = [...new Set([userId, ...friendIds, ...pendingUserIds])];
    
    let query = db(MODULE.USER)
      .whereNotIn('id', excludedIds)
      .where('active', true);
    
    if (search) {
      query = query.where(function() {
        this.whereILike('username', `%${search}%`)
          .orWhereILike('email', `%${search}%`);
      });
    }
    
    return query
      .select('id', 'username', 'email', 'avatar_url', 'created_at')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);
  }

  async countNonFriends({ userId, search = '' }) {
    const friendIds = await this.getAllFriendIds(userId);
    
    const pendingRequests = await db(MODULE.FRIEND_REQUEST)
      .where('from', userId)
      .orWhere('to', userId)
      .select('from', 'to');
    
    const pendingUserIds = pendingRequests.flatMap(r => 
      r.from === userId ? [r.to] : [r.from]
    );
    
    const excludedIds = [...new Set([userId, ...friendIds, ...pendingUserIds])];
    
    let query = db(MODULE.USER)
      .whereNotIn('id', excludedIds)
      .where('active', true);
    
    if (search) {
      query = query.where(function() {
        this.whereILike('username', `%${search}%`)
          .orWhereILike('email', `%${search}%`);
      });
    }
    
    return query.count('* as total').first();
  }
}

module.exports = new FriendRepo();
