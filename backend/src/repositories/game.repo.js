const db = require("../databases/knex");
const MODULE = require("../constants/module");

class GameRepo {
  create(data) {
    return db(MODULE.GAME)
      .insert(data)
      .returning("*")
      .then(([row]) => row);
  }

  findById(id) {
    return db(MODULE.GAME).where("id", id).first();
  }

  findByCode(code) {
    return db(MODULE.GAME).where("code", code).first();
  }

  findAllActive() {
    return db(MODULE.GAME).where("is_active", true);
  }

  findAll() {
    return db(MODULE.GAME);
  }

  update(id, data) {
    return db(MODULE.GAME)
      .where("id", id)
      .update(data)
      .returning("*")
      .then(([row]) => row);
  }

  delete(id) {
    return db(MODULE.GAME).where("id", id).del();
  }

  createSession(data) {
    return db(MODULE.GAME_SESSION)
      .insert(data)
      .returning("*")
      .then(([row]) => row);
  }

  findSessionById(id) {
    return db(MODULE.GAME_SESSION).where("id", id).first();
  }

  findSessionByUserAndGameAndStatus(userId, gameId, status) {
    return db(MODULE.GAME_SESSION)
      .where("user_id", userId)
      .andWhere("game_id", gameId)
      .andWhere("status", status)
      .orderBy("updated_at", "desc")
      .first();
  }

  findSessionsByUserAndStatus(userId, status) {
    return db(MODULE.GAME_SESSION)
      .where("user_id", userId)
      .andWhere("status", status)
      .orderBy("updated_at", "desc");
  }

  updateSession(id, data) {
    return db(MODULE.GAME_SESSION)
      .where("id", id)
      .update({ ...data, updated_at: db.fn.now() })
      .returning("*")
      .then(([row]) => row);
  }

  createSave(data) {
    return db(MODULE.GAME_SAVE)
      .insert(data)
      .returning("*")
      .then(([row]) => row);
  }

  findLatestSaveBySessionId(sessionId) {
    return db(MODULE.GAME_SAVE)
      .where("session_id", sessionId)
      .orderBy("saved_at", "desc")
      .first();
  }

  findBestScore(userId, gameId) {
    return db(MODULE.GAME_BEST_SCORE)
      .where("user_id", userId)
      .andWhere("game_id", gameId)
      .first();
  }

  createBestScore(data) {
    return db(MODULE.GAME_BEST_SCORE)
      .insert(data)
      .returning("*")
      .then(([row]) => row);
  }

  updateBestScore(id, data) {
    return db(MODULE.GAME_BEST_SCORE)
      .where("id", id)
      .update({ ...data, achieved_at: db.fn.now() })
      .returning("*")
      .then(([row]) => row);
  }

  findLeaderboard(gameId, limit = 10) {
    return db(MODULE.GAME_BEST_SCORE)
      .select("game_best_scores.*", "users.username", "users.avatar_url")
      .leftJoin("users", "game_best_scores.user_id", "users.id")
      .where("game_best_scores.game_id", gameId)
      .orderBy("game_best_scores.best_score", "desc")
      .limit(limit);
  }
}

module.exports = new GameRepo();
