const HTTP_STATUS = require("../constants/http-status");
const scoreService = require("../services/score.service");
const rankingService = require("../services/ranking.service");
const ResponseHandler = require("../utils/response-handler");

class ScoreController {
  /**
   * Submit a score for a game
   * POST /api/scores
   */
  async submitScore(req, res, next) {
    try {
      const { game_type, score } = req.body;
      const user_id = req.user?.id || null;

      const result = await scoreService.submitScore({
        user_id,
        game_type,
        score,
      });

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.CREATED,
        message: "Score submitted successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get leaderboard for a specific game
   * GET /api/scores/ranking/:gameType
   */
  async getLeaderboard(req, res, next) {
    try {
      const { gameType } = req.params;
      const { limit } = req.query;

      const leaderboard = await rankingService.getLeaderboard(
        gameType,
        limit ? parseInt(limit) : 10
      );

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Leaderboard retrieved successfully",
        data: {
          game_type: gameType,
          leaderboard,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get global top scores across all games
   * GET /api/scores/global-top
   */
  async getGlobalTopScores(req, res, next) {
    try {
      const { limit } = req.query;

      const topScores = await rankingService.getGlobalTopScores(
        limit ? parseInt(limit) : 10
      );

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Global top scores retrieved successfully",
        data: topScores,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get user's ranking for a specific game
   * GET /api/scores/user-rank/:gameType
   */
  async getUserGameRank(req, res, next) {
    try {
      const { gameType } = req.params;
      const user_id = req.user?.id || null;

      const userRank = await rankingService.getUserGameRank(user_id, gameType);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "User ranking retrieved successfully",
        data: userRank,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get authenticated user's all scores with pagination
   * GET /api/scores/me?gameType=snake&page=1&limit=10
   */
  async getMyScores(req, res, next) {
    try {
      const user_id = req.user?.id;
      const { gameType, page, limit } = req.query;

      const result = await scoreService.getUserScores(user_id, {
        gameType: gameType || null,
        page: page || 1,
        limit: limit || 10,
      });

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "User scores retrieved successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get authenticated user's best score for a specific game
   * GET /api/scores/best/:gameType
   */
  async getMyBestScore(req, res, next) {
    try {
      const user_id = req.user?.id;
      const { gameType } = req.params;

      const bestScore = await scoreService.getMyBestScore(user_id, gameType);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "User best score retrieved successfully",
        data: bestScore,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ScoreController();
