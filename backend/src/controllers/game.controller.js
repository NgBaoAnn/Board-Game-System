const HTTP_STATUS = require("../constants/http-status");
const gameService = require("../services/game.service");
const ResponseHandler = require("../utils/response-handler");

class GameController {
  async getAllGames(req, res, next) {
    try {
      const games = await gameService.getAllGames();
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Games retrieved successfully",
        data: games,
      });
    } catch (err) {
      next(err);
    }
  }

  async getActiveGames(req, res, next) {
    try {
      const games = await gameService.getAllActiveGames();
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Active games retrieved successfully",
        data: games,
      });
    } catch (err) {
      next(err);
    }
  }

  async getGameById(req, res, next) {
    try {
      const { id } = req.params;
      const game = await gameService.getGameById(parseInt(id));
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Game retrieved successfully",
        data: game,
      });
    } catch (err) {
      next(err);
    }
  }

  async createGame(req, res, next) {
    try {
      const game = await gameService.createGame(req.body);
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.CREATED,
        message: "Game created successfully",
        data: game,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateGame(req, res, next) {
    try {
      const { id } = req.params;
      const game = await gameService.updateGame(parseInt(id), req.body);
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Game updated successfully",
        data: game,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteGame(req, res, next) {
    try {
      const { id } = req.params;
      await gameService.deleteGame(parseInt(id));
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Game deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  async startSession(req, res, next) {
    try {
      const userId = req.user.id;
      const { mode, game_id } = req.body;

      const result = await gameService.startSession(userId, mode, game_id);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message:
          mode === "new"
            ? "New game session started successfully"
            : "Game session resumed successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async saveSession(req, res, next) {
    try {
      const { id } = req.params;
      const { save_state } = req.body;

      const result = await gameService.saveSession(id, save_state);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Game session saved successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async finishSession(req, res, next) {
    try {
      const { id } = req.params;
      const { score } = req.body;

      const session = await gameService.finishSession(id, score);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Game session finished successfully",
        data: session,
      });
    } catch (err) {
      next(err);
    }
  }

  async isSessionSavedExists(req, res, next) {
    try {
      const userId = req.user.id;
      const gameId = req.params.id;

      const result = await gameService.isSessionSavedExists(userId, gameId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Game session saved successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getGamePlayStats(req, res, next) {
    try {
      const { filter } = req.query;

      const result = await gameService.getGamePlayStats(filter || "7d");

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Game play stats retrieved successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getGameActivity(req, res, next) {
    try {
      const { filter } = req.query;

      const result = await gameService.getGameActivity(filter);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Game activity retrieved successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getGameHistory(req, res, next) {
    try {
      const userId = req.params.userId;
      const { page, limit } = req.query;

      const result = await gameService.getGameHistory({
        userId,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
      });

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Game history retrieved successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
  async getTotalSessions(req, res, next) {
    try {
      const total = await gameService.getTotalSessions();
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Total sessions retrieved successfully",
        data: { total },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new GameController();
