const gameRepo = require("../repositories/game.repo");
const NotFoundError = require("../errors/notfound.exception");
const BadRequestError = require("../errors/badrequest.exception");
const { GAME_SESSION_STATUS } = require("../constants/game-session.constants");

class GameService {
  async createGame(data) {
    const existing = await gameRepo.findByCode(data.code);
    if (existing) {
      throw new BadRequestError("Game code already exists");
    }
    return gameRepo.create(data);
  }

  async getGameById(id) {
    const game = await gameRepo.findById(id);
    if (!game) {
      throw new NotFoundError("Game not found");
    }
    return game;
  }

  async getAllActiveGames() {
    return gameRepo.findAllActive();
  }

  async getAllGames() {
    return gameRepo.findAll();
  }

  async updateGame(id, data) {
    const game = await gameRepo.findById(id);
    if (!game) {
      throw new NotFoundError("Game not found");
    }
    return gameRepo.update(id, data);
  }

  async deleteGame(id) {
    const game = await gameRepo.findById(id);
    if (!game) {
      throw new NotFoundError("Game not found");
    }
    return gameRepo.delete(id);
  }

  async startSession(userId, mode, gameId) {
    const game = await gameRepo.findById(gameId);
    if (!game) {
      throw new NotFoundError("Game not found");
    }

    if (mode === "new") {
      return this._startNewSession(userId, gameId);
    } else if (mode === "resume") {
      return this._resumeSession(userId, gameId);
    } else {
      throw new BadRequestError("Invalid mode. Must be 'new' or 'resume'");
    }
  }

  async _startNewSession(userId, gameId) {
    const pausedSession = await gameRepo.findSessionByUserAndGameAndStatus(
      userId,
      gameId,
      GAME_SESSION_STATUS.PAUSED
    );

    if (pausedSession) {
      await this._finishPausedSession(pausedSession.id);
    }
    const newSession = await gameRepo.createSession({
      user_id: userId,
      game_id: gameId,
      status: GAME_SESSION_STATUS.PLAYING,
      time_remaining_seconds: null,
      final_score: null,
      ended_at: null,
    });

    return {
      session: newSession,
      save_state: null,
    };
  }

  async _resumeSession(userId, gameId) {
    const pausedSession = await gameRepo.findSessionByUserAndGameAndStatus(
      userId,
      gameId,
      GAME_SESSION_STATUS.PAUSED
    );

    if (!pausedSession) {
      throw new NotFoundError("No paused session found to resume");
    }

    const latestSave = await gameRepo.findLatestSaveBySessionId(
      pausedSession.id
    );
    const updatedSession = await gameRepo.updateSession(pausedSession.id, {
      status: GAME_SESSION_STATUS.PLAYING,
    });

    return {
      session: updatedSession,
      save_state: latestSave?.save_state || null,
    };
  }

  async _finishPausedSession(sessionId) {
    const latestSave = await gameRepo.findLatestSaveBySessionId(sessionId);

    let finalScore = 0;
    if (latestSave?.save_state) {
      const saveState =
        typeof latestSave.save_state === "string"
          ? JSON.parse(latestSave.save_state)
          : latestSave.save_state;
      finalScore = saveState.score || 0;
    }

    await gameRepo.updateSession(sessionId, {
      status: GAME_SESSION_STATUS.FINISHED,
      final_score: finalScore,
      ended_at: new Date(),
    });
  }

  async saveSession(sessionId, saveState) {
    const session = await gameRepo.findSessionById(sessionId);
    if (!session) {
      throw new NotFoundError("Session not found");
    }

    if (session.status !== GAME_SESSION_STATUS.PLAYING) {
      throw new BadRequestError("Can only save a playing session");
    }

    const updatedSession = await gameRepo.updateSession(sessionId, {
      status: GAME_SESSION_STATUS.PAUSED,
      time_remaining_seconds: saveState.time_remaining_seconds || null,
    });

    const save = await gameRepo.createSave({
      session_id: sessionId,
      save_state: saveState,
    });

    return {
      session: updatedSession,
      save: save,
    };
  }

  async finishSession(sessionId, score) {
    const session = await gameRepo.findSessionById(sessionId);
    if (!session) {
      throw new NotFoundError("Session not found");
    }

    if (session.status === GAME_SESSION_STATUS.FINISHED) {
      throw new BadRequestError("Session already finished");
    }

    const updatedSession = await gameRepo.updateSession(sessionId, {
      status: GAME_SESSION_STATUS.FINISHED,
      final_score: score,
      ended_at: new Date(),
    });

    await this.updateBestScore(session.user_id, session.game_id, score);

    return updatedSession;
  }

  async updateBestScore(userId, gameId, score) {
    const existing = await gameRepo.findBestScore(userId, gameId);

    if (!existing) {
      return gameRepo.createBestScore({
        user_id: userId,
        game_id: gameId,
        best_score: score,
      });
    }

    if (score > existing.best_score) {
      return gameRepo.updateBestScore(existing.id, {
        best_score: score,
      });
    }

    return existing;
  }
}

module.exports = new GameService();
