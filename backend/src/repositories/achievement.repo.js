const db = require("../databases/knex");
const MODULE = require("../constants/module");

class AchievementRepo {
  create(data) {
    return db(MODULE.ACHIEVEMENT)
      .insert(data)
      .returning("*")
      .then(([row]) => row);
  }

  findById(id) {
    return db(MODULE.ACHIEVEMENT).where("id", id).first();
  }

  findByCode(code) {
    return db(MODULE.ACHIEVEMENT).where("code", code).first();
  }

  findByGameId(gameId) {
    return db(MODULE.ACHIEVEMENT).where("game_id", gameId);
  }

  update(id, data) {
    return db(MODULE.ACHIEVEMENT)
      .where("id", id)
      .update(data)
      .returning("*")
      .then(([row]) => row);
  }

  delete(id) {
    return db(MODULE.ACHIEVEMENT).where("id", id).del();
  }

  // User achievements
  findUserAchievementsByGameId(userId, gameId) {
    return db(MODULE.USER_ACHIEVEMENT)
      .join(
        MODULE.ACHIEVEMENT,
        `${MODULE.USER_ACHIEVEMENT}.achievement_id`,
        `${MODULE.ACHIEVEMENT}.id`
      )
      .where({
        [`${MODULE.USER_ACHIEVEMENT}.user_id`]: userId,
        [`${MODULE.ACHIEVEMENT}.game_id`]: gameId,
      })
      .select(
        `${MODULE.ACHIEVEMENT}.*`,
        `${MODULE.USER_ACHIEVEMENT}.achieved_at`
      );
  }

  // Get all achievements for a user across all games
  findAllUserAchievements(userId) {
    return db(MODULE.USER_ACHIEVEMENT)
      .join(
        MODULE.ACHIEVEMENT,
        `${MODULE.USER_ACHIEVEMENT}.achievement_id`,
        `${MODULE.ACHIEVEMENT}.id`
      )
      .join(
        MODULE.GAME,
        `${MODULE.ACHIEVEMENT}.game_id`,
        `${MODULE.GAME}.id`
      )
      .where({ [`${MODULE.USER_ACHIEVEMENT}.user_id`]: userId })
      .select(
        `${MODULE.ACHIEVEMENT}.*`,
        `${MODULE.USER_ACHIEVEMENT}.achieved_at`,
        `${MODULE.GAME}.name as game_name`,
        `${MODULE.GAME}.code as game_code`
      )
      .orderBy(`${MODULE.USER_ACHIEVEMENT}.achieved_at`, 'desc');
  }

  findUserAchievement(userId, achievementId) {
    return db(MODULE.USER_ACHIEVEMENT)
      .where({
        user_id: userId,
        achievement_id: achievementId,
      })
      .first();
  }

  createUserAchievement(data) {
    return db(MODULE.USER_ACHIEVEMENT)
      .insert(data)
      .returning("*")
      .then(([row]) => row);
  }

  deleteUserAchievement(userId, achievementId) {
    return db(MODULE.USER_ACHIEVEMENT)
      .where({
        user_id: userId,
        achievement_id: achievementId,
      })
      .del();
  }
}

module.exports = new AchievementRepo();
