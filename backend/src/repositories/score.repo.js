const db = require("../databases/knex");
const MODULE = require("../constants/module");

class ScoreRepo {
  /**
   * Create a new score record
   * @param {Object} data - Score data
   * @param {string|null} data.user_id - User ID (UUID or null for anonymous)
   * @param {string} data.game_type - Game type
   * @param {number} data.score - Score value
   * @returns {Promise<Object>} - Created score record
   */
  create(data) {
    return db(MODULE.SCORE)
      .insert(data)
      .returning("*")
      .then(([row]) => row);
  }

  /**
   * Find top scores for a specific game type
   * @param {string} gameType - Game type to query
   * @param {number} limit - Maximum number of records to return (default: 10)
   * @returns {Promise<Array>} - Array of top scores ordered by score descending
   */
  findTopByGame(gameType, limit = 10) {
    return db(MODULE.SCORE)
      .where("game_type", gameType)
      .orderBy("score", "desc")
      .limit(limit);
  }

  /**
   * Find the best score of a user for a specific game
   * @param {string|null} userId - User ID (UUID)
   * @param {string} gameType - Game type to query
   * @returns {Promise<Object|null>} - Best score record or null if not found
   */
  findBestByUser(userId, gameType) {
    return db(MODULE.SCORE)
      .where("user_id", userId)
      .andWhere("game_type", gameType)
      .orderBy("score", "desc")
      .first();
  }

  /**
   * Get all scores by user with pagination
   * @param {string} userId - User ID (UUID)
   * @param {Object} options - Query options
   * @param {string|null} options.gameType - Filter by game type (optional)
   * @param {number} options.offset - Pagination offset (default: 0)
   * @param {number} options.limit - Pagination limit (default: 10)
   * @returns {Promise<Array>} - Array of score records ordered by created_at descending
   */
  findByUser(userId, { gameType = null, offset = 0, limit = 10 } = {}) {
    let query = db(MODULE.SCORE).where("user_id", userId);

    if (gameType) {
      query = query.andWhere("game_type", gameType);
    }

    return query
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);
  }

  /**
   * Count total scores by user
   * @param {string} userId - User ID (UUID)
   * @param {string|null} gameType - Filter by game type (optional)
   * @returns {Promise<Object>} - Object with total count
   */
  countByUser(userId, gameType = null) {
    let query = db(MODULE.SCORE).where("user_id", userId);

    if (gameType) {
      query = query.andWhere("game_type", gameType);
    }

    return query.count("* as total").first();
  }
}

module.exports = new ScoreRepo();
