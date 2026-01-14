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

  // Admin: Get all achievements with pagination, search, and filter
  async findAll({ page = 1, limit = 10, search = "", game_id, condition_type }) {
    const offset = (page - 1) * limit;

    let query = db(MODULE.ACHIEVEMENT)
      .join(MODULE.GAME, `${MODULE.ACHIEVEMENT}.game_id`, `${MODULE.GAME}.id`);

    if (search) {
      query = query.where((builder) => {
        builder
          .where(`${MODULE.ACHIEVEMENT}.name`, "ilike", `%${search}%`)
          .orWhere(`${MODULE.ACHIEVEMENT}.description`, "ilike", `%${search}%`);
      });
    }

    if (game_id) {
      query = query.where(`${MODULE.ACHIEVEMENT}.game_id`, game_id);
    }

    if (condition_type) {
      query = query.where(`${MODULE.ACHIEVEMENT}.condition_type`, condition_type);
    }

    const [totalResult, data] = await Promise.all([
      query.clone().count(`${MODULE.ACHIEVEMENT}.id as total`).first(),
      query
        .clone()
        .select(
          `${MODULE.ACHIEVEMENT}.*`,
          `${MODULE.GAME}.name as game_name`,
          `${MODULE.GAME}.code as game_code`
        )
        .orderBy(`${MODULE.ACHIEVEMENT}.created_at`, "desc")
        .limit(limit)
        .offset(offset),
    ]);

    return {
      data,
      total: parseInt(totalResult.total) || 0,
      page,
      limit,
      totalPages: Math.ceil((parseInt(totalResult.total) || 0) / limit),
    };
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
