const rankingRepo = require("../repositories/ranking.repo");
const friendRepo = require("../repositories/friend.repo");

class RankingService {
  /**
   * Get user's finished game sessions for a specific game (paginated)
   * Data source: game_sessions table
   */
  async getMySelfRanking(userId, gameId, { page = 1, limit = 10 } = {}) {
    return rankingRepo.getMySelfSessions(userId, gameId, { page, limit });
  }

  /**
   * Get friends' best scores for a specific game (paginated)
   * Includes the current user for comparison
   * Data source: friends table + game_best_scores table
   */
  async getFriendRanking(userId, gameId, { page = 1, limit = 10 } = {}) {
    // Reuse getAllFriendIds from friendRepo
    const friendIds = await friendRepo.getAllFriendIds(userId);

    // Include current user in the list for comparison
    const userIds = [userId, ...friendIds];

    return rankingRepo.getFriendBestScores(userIds, gameId, { page, limit });
  }

  /**
   * Get system-wide best scores for a specific game (paginated)
   * Data source: game_best_scores table
   */
  async getSystemRanking(gameId, { page = 1, limit = 10 } = {}) {
    return rankingRepo.getSystemLeaderboard(gameId, { page, limit });
  }
}

module.exports = new RankingService();
