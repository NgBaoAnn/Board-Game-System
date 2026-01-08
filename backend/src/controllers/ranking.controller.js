const HTTP_STATUS = require("../constants/http-status");
const rankingService = require("../services/ranking.service");
const ResponseHandler = require("../utils/response-handler");

class RankingController {
  async getMySelfRanking(req, res, next) {
    try {
      const userId = req.user.id;
      const gameId = req.params.game_id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const response = await rankingService.getMySelfRanking(userId, gameId, {
        page,
        limit,
      });
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async getFriendRanking(req, res, next) {
    try {
      const userId = req.user.id;
      const gameId = req.params.game_id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const response = await rankingService.getFriendRanking(userId, gameId, {
        page,
        limit,
      });
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async getSystemRanking(req, res, next) {
    try {
      const gameId = req.params.game_id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const response = await rankingService.getSystemRanking(gameId, {
        page,
        limit,
      });
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RankingController();
