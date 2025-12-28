const scoreRepo = require("../repositories/score.repo");
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
    const record = await scoreRepo.create({
      user_id,
      game_type,
      score: normalizedScore,
    });

    return {
      id: record.id,
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

    return scoreRepo.findBestByUser(userId, gameType);
  }

  /**
   * Get user's all scores with optional filtering and pagination
   * @param {string} userId - User ID (UUID)
   * @param {Object} query - Query options
   * @param {string|null} query.gameType - Filter by game type (optional)
   * @param {number} query.page - Page number (default: 1)
   * @param {number} query.limit - Items per page (default: 10)
   * @returns {Promise<Object>} - Paginated scores with pagination info
   */
  async getUserScores(userId, { gameType = null, page = 1, limit = 10 } = {}) {
    // Validate page and limit
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(parseInt(limit) || 10, 100)); // Max 100 per page
    const offset = (pageNum - 1) * limitNum;

    // Validate gameType if provided
    if (gameType && !SUPPORTED_GAMES.includes(gameType)) {
      throw new BadRequestError(
        `Invalid game type. Supported games: ${SUPPORTED_GAMES.join(", ")}`
      );
    }

    // Fetch scores and total count in parallel
    const [scores, countResult] = await Promise.all([
      scoreRepo.findByUser(userId, { gameType, offset, limit: limitNum }),
      scoreRepo.countByUser(userId, gameType),
    ]);

    const total = parseInt(countResult.total);

    return {
      data: scores,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
      },
    };
  }

  /**
   * Get user's best score for a specific game
   * @param {string} userId - User ID (UUID)
   * @param {string} gameType - Game type
   * @returns {Promise<Object|null>} - User's best score or null if not found
   */
  async getMyBestScore(userId, gameType) {
    // Validate gameType
    if (!SUPPORTED_GAMES.includes(gameType)) {
      throw new BadRequestError(
        `Invalid game type. Supported games: ${SUPPORTED_GAMES.join(", ")}`
      );
    }

    return scoreRepo.findBestByUser(userId, gameType);
  }
}

module.exports = new ScoreService();
