const db = require("../databases/knex");
const MODULE = require("../constants/module");

class ScoreModel {
  /**
   * Create a new score record
   * @param {Object} data - Score data
   * @param {string|null} data.user_id - User ID (UUID or null for anonymous)
   * @param {string} data.game_type - Game type (tic_tac_toe, caro_4, caro_5, snake, match_3, memory, free_draw)
   * @param {number} data.score - Score value (non-negative integer)
   * @returns {Promise<number>} - ID of created score record
   */
  async create(data) {
    const [id] = await db(MODULE.SCORE).insert(data);
    return id;
  }

  /**
   * Find top scores for a specific game type
   * @param {string} gameType - Game type to query
   * @param {number} limit - Maximum number of records to return (default: 10)
   * @returns {Promise<Array>} - Array of top scores ordered by score descending
   */
  async findTopByGame(gameType, limit = 10) {
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
  async findBestByUser(userId, gameType) {
    return db(MODULE.SCORE)
      .where("user_id", userId)
      .andWhere("game_type", gameType)
      .orderBy("score", "desc")
      .first();
  }
}

module.exports = new ScoreModel();
