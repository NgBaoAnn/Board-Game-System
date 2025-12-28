const scoreRepo = require("../repositories/score.repo");
const BadRequestError = require("../errors/badrequest.exception");
const { SUPPORTED_GAMES } = require("../constants/game.constants");

class RankingService {
  /**
   * Get leaderboard for a specific game
   * Returns top scores ranked and formatted
   * @param {string} gameType - Game type to get rankings for
   * @param {number} limit - Maximum number of entries (default: 10, max: 100)
   * @returns {Promise<Array>} - Formatted leaderboard with rank, user_id, score
   */
  async getLeaderboard(gameType, limit = 10) {
    // Validate game type
    if (!SUPPORTED_GAMES.includes(gameType)) {
      throw new BadRequestError(
        `Invalid game type. Supported games: ${SUPPORTED_GAMES.join(", ")}`
      );
    }

    // Clamp limit between 1 and 100
    const clampedLimit = Math.max(1, Math.min(limit, 100));

    // Fetch top scores from repository
    const scores = await scoreRepo.findTopByGame(gameType, clampedLimit);

    // Format with rank
    const leaderboard = scores.map((entry, index) => ({
      rank: index + 1,
      user_id: entry.user_id,
      score: entry.score,
      created_at: entry.created_at,
      updated_at: entry.updated_at,
    }));

    return leaderboard;
  }

  /**
   * Get top N scores across all games
   * @param {number} limit - Number of top games to return (default: 10, max: 50)
   * @returns {Promise<Array>} - Top scores with game info
   */
  async getGlobalTopScores(limit = 10) {
    const clampedLimit = Math.max(1, Math.min(limit, 50));

    // Get top scores for each game and flatten
    const allScores = await Promise.all(
      SUPPORTED_GAMES.map((gameType) =>
        scoreRepo.findTopByGame(gameType, clampedLimit)
      )
    );

    // Combine all scores, sort globally, and take top N
    const combinedScores = allScores
      .flat()
      .sort((a, b) => b.score - a.score)
      .slice(0, clampedLimit);

    // Format with rank and game info
    const topScores = combinedScores.map((entry, index) => ({
      rank: index + 1,
      user_id: entry.user_id,
      game_type: entry.game_type,
      score: entry.score,
      created_at: entry.created_at,
      updated_at: entry.updated_at,
    }));

    return topScores;
  }

  /**
   * Get user's ranking position for a specific game
   * @param {string|null} userId - User ID to find ranking for
   * @param {string} gameType - Game type
   * @returns {Promise<Object|null>} - User's ranking info or null if not ranked
   */
  async getUserGameRank(userId, gameType) {
    // Validate game type
    if (!SUPPORTED_GAMES.includes(gameType)) {
      throw new BadRequestError(
        `Invalid game type. Supported games: ${SUPPORTED_GAMES.join(", ")}`
      );
    }

    // Get top 1000 scores to find user's rank
    // (assuming not many players will be in top 1000)
    const topScores = await scoreRepo.findTopByGame(gameType, 1000);

    // Find user's best score
    const userScore = topScores.find((entry) => entry.user_id === userId);

    if (!userScore) {
      return null;
    }

    // Calculate rank by finding position
    const rank = topScores.findIndex((entry) => entry.id === userScore.id) + 1;

    return {
      rank,
      user_id: userScore.user_id,
      game_type: gameType,
      score: userScore.score,
      created_at: userScore.created_at,
      updated_at: userScore.updated_at,
    };
  }
}

module.exports = new RankingService();
