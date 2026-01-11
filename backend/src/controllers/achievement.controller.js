const HTTP_STATUS = require("../constants/http-status");
const achievementService = require("../services/achievement.service");
const ResponseHandler = require("../utils/response-handler");

class AchievementController {
  async createAchievement(req, res, next) {
    try {
      const achievement = await achievementService.createAchievement(req.body);
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.CREATED,
        message: "Achievement created successfully",
        data: achievement,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAchievementById(req, res, next) {
    try {
      const { id } = req.params;
      const achievement = await achievementService.getAchievementById(id);
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Achievement retrieved successfully",
        data: achievement,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAchievementsByGameId(req, res, next) {
    try {
      const { game_id } = req.params;
      const achievements = await achievementService.getAchievementsByGameId(
        parseInt(game_id)
      );
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Achievements retrieved successfully",
        data: achievements,
      });
    } catch (err) {
      next(err);
    }
  }

  async getUserAchievementsByGameId(req, res, next) {
    try {
      const { game_id, user_id } = req.params;
      const achievements = await achievementService.getUserAchievementsByGameId(
        user_id,
        parseInt(game_id)
      );
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "User achievements retrieved successfully",
        data: achievements,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateAchievement(req, res, next) {
    try {
      const { id } = req.params;
      const achievement = await achievementService.updateAchievement(
        id,
        req.body
      );
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Achievement updated successfully",
        data: achievement,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteAchievement(req, res, next) {
    try {
      const { id } = req.params;
      await achievementService.deleteAchievement(id);
      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Achievement deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AchievementController();
