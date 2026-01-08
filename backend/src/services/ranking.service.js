const rankingRepo = require("../repositories/ranking.repo");
const friendRepo = require("../repositories/friend.repo");

class RankingService {
  async getMySelfRanking(userId, gameId, { page = 1, limit = 10 } = {}) {
    return rankingRepo.getMySelfSessions(userId, gameId, { page, limit });
  }

  async getFriendRanking(userId, gameId, { page = 1, limit = 10 } = {}) {
    const friendIds = await friendRepo.getAllFriendIds(userId);

    const userIds = [userId, ...friendIds];

    return rankingRepo.getFriendBestScores(userIds, gameId, { page, limit });
  }

  async getSystemRanking(gameId, { page = 1, limit = 10 } = {}) {
    return rankingRepo.getSystemLeaderboard(gameId, { page, limit });
  }
}

module.exports = new RankingService();
