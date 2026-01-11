const db = require("../databases/knex");
const MODULE = require("../constants/module");

class GameRepo {
  create(data) {
    return db(MODULE.GAME)
      .insert(data)
      .returning("*")
      .then(([row]) => row);
  }

  findById(id) {
    return db(MODULE.GAME).where("id", id).first();
  }

  findByCode(code) {
    return db(MODULE.GAME).where("code", code).first();
  }

  findAllActive() {
    return db(MODULE.GAME).where("is_active", true);
  }

  findAll() {
    return db(MODULE.GAME);
  }

  update(id, data) {
    return db(MODULE.GAME)
      .where("id", id)
      .update(data)
      .returning("*")
      .then(([row]) => row);
  }

  delete(id) {
    return db(MODULE.GAME).where("id", id).del();
  }

  createSession(data) {
    return db(MODULE.GAME_SESSION)
      .insert(data)
      .returning("*")
      .then(([row]) => row);
  }

  findSessionById(id) {
    return db(MODULE.GAME_SESSION).where("id", id).first();
  }

  findSessionByUserAndGameAndStatus(userId, gameId, status) {
    return db(MODULE.GAME_SESSION)
      .where("user_id", userId)
      .andWhere("game_id", gameId)
      .andWhere("status", status)
      .orderBy("updated_at", "desc")
      .first();
  }

  findSessionsByUserAndStatus(userId, status) {
    return db(MODULE.GAME_SESSION)
      .where("user_id", userId)
      .andWhere("status", status)
      .orderBy("updated_at", "desc");
  }

  updateSession(id, data) {
    return db(MODULE.GAME_SESSION)
      .where("id", id)
      .update({ ...data, updated_at: db.fn.now() })
      .returning("*")
      .then(([row]) => row);
  }

  createSave(data) {
    return db(MODULE.GAME_SAVE)
      .insert(data)
      .returning("*")
      .then(([row]) => row);
  }

  findLatestSaveBySessionId(sessionId) {
    return db(MODULE.GAME_SAVE)
      .where("session_id", sessionId)
      .orderBy("saved_at", "desc")
      .first();
  }

  findBestScore(userId, gameId) {
    return db(MODULE.GAME_BEST_SCORE)
      .where("user_id", userId)
      .andWhere("game_id", gameId)
      .first();
  }

  createBestScore(data) {
    return db(MODULE.GAME_BEST_SCORE)
      .insert(data)
      .returning("*")
      .then(([row]) => row);
  }

  updateBestScore(id, data) {
    return db(MODULE.GAME_BEST_SCORE)
      .where("id", id)
      .update({ ...data, achieved_at: db.fn.now() })
      .returning("*")
      .then(([row]) => row);
  }

  findLeaderboard(gameId, limit = 10) {
    return db(MODULE.GAME_BEST_SCORE)
      .select("game_best_scores.*", "users.username", "users.avatar_url")
      .leftJoin("users", "game_best_scores.user_id", "users.id")
      .where("game_best_scores.game_id", gameId)
      .orderBy("game_best_scores.best_score", "desc")
      .limit(limit);
  }

  getGameHistoryByUserId({ userId, offset = 0, limit = 10 }) {
    return db(MODULE.GAME_SESSION)
      .select(
        "game_sessions.id",
        "game_sessions.status",
        "game_sessions.final_score",
        "game_sessions.created_at",
        "game_sessions.ended_at",
        "games.name as game_name",
        "games.code as game_code",
        "games.image_url as game_image"
      )
      .leftJoin(MODULE.GAME, "game_sessions.game_id", "games.id")
      .where("game_sessions.user_id", userId)
      .where("game_sessions.status", "finished")
      .orderBy("game_sessions.created_at", "desc")
      .limit(limit)
      .offset(offset);
  }

  countGameHistoryByUserId(userId) {
    return db(MODULE.GAME_SESSION)
      .where("user_id", userId)
      .where("status", "finished")
      .count("* as total")
      .first();
  }

  async countGameSession(gameId) {
    const result = await db(MODULE.GAME_SESSION)
      .where("game_id", gameId)
      .count("id as total");

    return Number(result[0].total);
  }

  async getGamePlayStats(filter) {
    const now = new Date();
    let startDate;
    let stats = {};

    if (filter === "7d" || !filter) {
      // Last 7 days - group by day of month
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);

      // Initialize all 7 days with 0
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const day = date.getDate();
        stats[day.toString()] = 0;
      }

      const results = await db(MODULE.GAME_SESSION)
        .select(db.raw("EXTRACT(DAY FROM created_at)::integer as period"))
        .count("id as count")
        .where("created_at", ">=", startDate)
        .groupByRaw("EXTRACT(DAY FROM created_at)")
        .orderByRaw("EXTRACT(DAY FROM created_at)");

      results.forEach((row) => {
        stats[row.period.toString()] = parseInt(row.count);
      });
    } else if (filter === "30d") {
      // Last 30 days - group by day of month
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);

      // Initialize all 30 days with 0
      for (let i = 0; i < 30; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const day = date.getDate();
        stats[day.toString()] = 0;
      }

      const results = await db(MODULE.GAME_SESSION)
        .select(db.raw("EXTRACT(DAY FROM created_at)::integer as period"))
        .count("id as count")
        .where("created_at", ">=", startDate)
        .groupByRaw("EXTRACT(DAY FROM created_at)")
        .orderByRaw("EXTRACT(DAY FROM created_at)");

      results.forEach((row) => {
        stats[row.period.toString()] = parseInt(row.count);
      });
    } else if (filter === "12m") {
      // Last 12 months - group by month
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 11);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);

      // Initialize all 12 months with 0
      for (let i = 0; i < 12; i++) {
        const date = new Date(startDate);
        date.setMonth(startDate.getMonth() + i);
        const month = date.getMonth() + 1; // JavaScript months are 0-indexed
        stats[month.toString()] = 0;
      }

      const results = await db(MODULE.GAME_SESSION)
        .select(db.raw("EXTRACT(MONTH FROM created_at)::integer as period"))
        .count("id as count")
        .where("created_at", ">=", startDate)
        .groupByRaw("EXTRACT(MONTH FROM created_at)")
        .orderByRaw("EXTRACT(MONTH FROM created_at)");

      results.forEach((row) => {
        stats[row.period.toString()] = parseInt(row.count);
      });
    }

    return stats;
  }

  async getGameActivity(filter) {
    let startDate;
    const now = new Date();

    if (filter === "7d") {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
    } else if (filter === "30d") {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);
    } else if (filter === "12m") {
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 11);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    } else {
      // Default to all time
      startDate = new Date(0);
    }

    const results = await db(MODULE.GAME)
      .select("games.name")
      .count("game_sessions.id as total_sessions")
      .leftJoin(MODULE.GAME_SESSION, function () {
        this.on("games.id", "=", "game_sessions.game_id").andOn(
          "game_sessions.created_at",
          ">=",
          db.raw("?", [startDate])
        );
      })
      .groupBy("games.id", "games.name")
      .orderBy("total_sessions", "desc");

    return results.map((row) => ({
      name: row.name,
      total_sessions: parseInt(row.total_sessions) || 0,
    }));
  }
}

module.exports = new GameRepo();
