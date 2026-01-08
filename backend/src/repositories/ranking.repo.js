const db = require("../databases/knex");
const MODULE = require("../constants/module");

class RankingRepo {
  /**
   * Get user's finished game sessions with pagination, sorted by final_score
   */
  async getMySelfSessions(userId, gameId, { page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;

    const [data, countResult] = await Promise.all([
      db(MODULE.GAME_SESSION)
        .select(
          "game_sessions.id",
          "game_sessions.final_score",
          "game_sessions.ended_at",
          "game_sessions.created_at",
          "users.username",
          "users.avatar_url"
        )
        .leftJoin("users", "game_sessions.user_id", "users.id")
        .where("game_sessions.user_id", userId)
        .andWhere("game_sessions.game_id", gameId)
        .andWhere("game_sessions.status", "finished")
        .whereNotNull("game_sessions.final_score")
        .orderBy("game_sessions.final_score", "desc")
        .limit(limit)
        .offset(offset),

      db(MODULE.GAME_SESSION)
        .where("user_id", userId)
        .andWhere("game_id", gameId)
        .andWhere("status", "finished")
        .whereNotNull("final_score")
        .count("* as total")
        .first(),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total: Number(countResult.total),
      },
    };
  }

  /**
   * Get best scores for a list of friend user IDs with pagination
   */
  async getFriendBestScores(friendIds, gameId, { page = 1, limit = 10 }) {
    if (!friendIds || friendIds.length === 0) {
      return {
        data: [],
        pagination: { page, limit, total: 0 },
      };
    }

    const offset = (page - 1) * limit;

    const [data, countResult] = await Promise.all([
      db(MODULE.GAME_BEST_SCORE)
        .select(
          "game_best_scores.id",
          "game_best_scores.user_id",
          "game_best_scores.best_score",
          "game_best_scores.achieved_at",
          "users.username",
          "users.avatar_url"
        )
        .leftJoin("users", "game_best_scores.user_id", "users.id")
        .where("game_best_scores.game_id", gameId)
        .whereIn("game_best_scores.user_id", friendIds)
        .orderBy("game_best_scores.best_score", "desc")
        .limit(limit)
        .offset(offset),

      db(MODULE.GAME_BEST_SCORE)
        .where("game_id", gameId)
        .whereIn("user_id", friendIds)
        .count("* as total")
        .first(),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total: Number(countResult.total),
      },
    };
  }

  /**
   * Get system-wide leaderboard with pagination
   */
  async getSystemLeaderboard(gameId, { page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;

    const [data, countResult] = await Promise.all([
      db(MODULE.GAME_BEST_SCORE)
        .select(
          "game_best_scores.id",
          "game_best_scores.user_id",
          "game_best_scores.best_score",
          "game_best_scores.achieved_at",
          "users.username",
          "users.avatar_url"
        )
        .leftJoin("users", "game_best_scores.user_id", "users.id")
        .where("game_best_scores.game_id", gameId)
        .orderBy("game_best_scores.best_score", "desc")
        .limit(limit)
        .offset(offset),

      db(MODULE.GAME_BEST_SCORE)
        .where("game_id", gameId)
        .count("* as total")
        .first(),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total: Number(countResult.total),
      },
    };
  }
}

module.exports = new RankingRepo();
