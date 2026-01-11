const achievementRepo = require("../repositories/achievement.repo");
const gameRepo = require("../repositories/game.repo");
const userRepo = require("../repositories/user.repo");
const NotFoundError = require("../errors/notfound.exception");
const BadRequestError = require("../errors/badrequest.exception");
const DuplicateError = require("../errors/duplicate.exception");
const {
  ACHIEVEMENT_CONDITION_TYPE_VALUES,
} = require("../constants/achievement.constants");

class AchievementService {
  async createAchievement(data) {
    // Validate game exists
    const game = await gameRepo.findById(data.game_id);
    if (!game) {
      throw new NotFoundError("Game not found");
    }

    // Check if code already exists
    const existing = await achievementRepo.findByCode(data.code);
    if (existing) {
      throw new DuplicateError("Achievement code already exists");
    }

    // Validate condition type
    if (!ACHIEVEMENT_CONDITION_TYPE_VALUES.includes(data.condition_type)) {
      throw new BadRequestError("Invalid condition type");
    }

    // Validate condition value
    if (!data.condition_value || data.condition_value <= 0) {
      throw new BadRequestError("Condition value must be greater than 0");
    }

    return achievementRepo.create(data);
  }

  async getAchievementById(id) {
    const achievement = await achievementRepo.findById(id);
    if (!achievement) {
      throw new NotFoundError("Achievement not found");
    }
    return achievement;
  }

  async getAchievementsByGameId(gameId) {
    // Validate game exists
    const game = await gameRepo.findById(gameId);
    if (!game) {
      throw new NotFoundError("Game not found");
    }

    return achievementRepo.findByGameId(gameId);
  }

  async getUserAchievementsByGameId(userId, gameId) {
    // Validate user exists
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Validate game exists
    const game = await gameRepo.findById(gameId);
    if (!game) {
      throw new NotFoundError("Game not found");
    }

    return achievementRepo.findUserAchievementsByGameId(userId, gameId);
  }

  async updateAchievement(id, data) {
    const achievement = await achievementRepo.findById(id);
    if (!achievement) {
      throw new NotFoundError("Achievement not found");
    }

    // If updating code, check for duplicates
    if (data.code && data.code !== achievement.code) {
      const existing = await achievementRepo.findByCode(data.code);
      if (existing) {
        throw new DuplicateError("Achievement code already exists");
      }
    }

    // If updating game_id, validate game exists
    if (data.game_id && data.game_id !== achievement.game_id) {
      const game = await gameRepo.findById(data.game_id);
      if (!game) {
        throw new NotFoundError("Game not found");
      }
    }

    // Validate condition type if provided
    if (
      data.condition_type &&
      !ACHIEVEMENT_CONDITION_TYPE_VALUES.includes(data.condition_type)
    ) {
      throw new BadRequestError("Invalid condition type");
    }

    // Validate condition value if provided
    if (data.condition_value !== undefined && data.condition_value <= 0) {
      throw new BadRequestError("Condition value must be greater than 0");
    }

    return achievementRepo.update(id, data);
  }

  async deleteAchievement(id) {
    const achievement = await achievementRepo.findById(id);
    if (!achievement) {
      throw new NotFoundError("Achievement not found");
    }
    return achievementRepo.delete(id);
  }

  /**
   * Check and grant achievements for a user based on their best score
   * This is a fallback/verification method to ensure achievements are granted
   * even if the database trigger didn't execute properly
   */
  async checkAndGrantAchievements(userId, gameId, bestScore) {
    // Get all achievements for this game
    const achievements = await achievementRepo.findByGameId(gameId);

    const newlyGranted = [];

    for (const achievement of achievements) {
      // Check if user already has this achievement
      const userHasAchievement = await achievementRepo.findUserAchievement(
        userId,
        achievement.id
      );

      // If user doesn't have it and meets the condition, grant it
      if (!userHasAchievement && bestScore >= achievement.condition_value) {
        await achievementRepo.createUserAchievement({
          user_id: userId,
          achievement_id: achievement.id,
        });
        newlyGranted.push(achievement);
      }
    }

    return newlyGranted;
  }
}

module.exports = new AchievementService();
