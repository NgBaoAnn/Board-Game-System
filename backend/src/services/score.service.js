const scoreModel = require("../models/score.model");
const BadRequestError = require("../errors/badrequest.exception");
const { SUPPORTED_GAMES, GAME_CONFIG } = require("../constants/game.constants");

class ScoreService {
  /**
   * Submit a score for a game
   * Validates input, clamps score to max value, and persists to database
   * @param {Object} data - Score submission data
   * @param {string|null} data.user_id - User ID (UUID or null for anonymous)
   * @param {string} data.game_type - Game type
   * @param {number} data.score - Raw score value
   * @returns {Promise<Object>} - Normalized score data with ID
   */
  async submitScore({ user_id, game_type, score }) {
    // Validate game type exists
    if (!SUPPORTED_GAMES.includes(game_type)) {
      throw new BadRequestError(
        `Invalid game type. Supported games: ${SUPPORTED_GAMES.join(", ")}`
      );
    }

    // Validate score is a number
    if (typeof score !== "number" || !Number.isInteger(score)) {
      throw new BadRequestError("Score must be an integer");
    }

    // Validate score is non-negative
    if (score < 0) {
      throw new BadRequestError("Score must be non-negative");
    }

    // Get max score for this game
    const maxScore = GAME_CONFIG[game_type].maxScore;

    // Clamp score to max allowed value
    const normalizedScore = Math.min(score, maxScore);

    // Persist to database
    const id = await scoreModel.create({
      user_id,
      game_type,
      score: normalizedScore,
    });

    return {
      id,
      user_id,
      game_type,
      score: normalizedScore,
      clamped: normalizedScore < score, // Indicate if score was clamped
    };
  }

  /**
   * Get user's best score for a game
   * @param {string|null} userId - User ID
   * @param {string} gameType - Game type
   * @returns {Promise<Object|null>} - User's best score record or null
   */
  async getUserBestScore(userId, gameType) {
    if (!SUPPORTED_GAMES.includes(gameType)) {
      throw new BadRequestError(
        `Invalid game type. Supported games: ${SUPPORTED_GAMES.join(", ")}`
      );
    }

    return scoreModel.findBestByUser(userId, gameType);
  }
}

module.exports = new ScoreService();
