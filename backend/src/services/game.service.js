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

  async isSessionSavedExists(userId, gameId) {
    const session = await gameRepo.findSessionByUserAndGameAndStatus(
      userId,
      gameId,
      GAME_SESSION_STATUS.PAUSED
    );
    if (!session) {
      return {
        isSavedExists: false,
        message: "No paused session found to resume",
      };
    }
    return {
      isSavedExists: true,
      message: "Paused session found",
    };
  }

  async getGamePlayStats(filter) {
    return await gameRepo.getGamePlayStats(filter);
  }

  async getGameActivity(filter) {
    return await gameRepo.getGameActivity(filter);
  }

  async getGameHistory({ userId, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;

    const [sessions, total] = await Promise.all([
      gameRepo.getGameHistoryByUserId({ userId, offset, limit }),
      gameRepo.countGameHistoryByUserId(userId),
    ]);

    // Calculate duration for each session
    const sessionsWithDuration = sessions.map((session) => {
      let duration = null;
      if (session.created_at && session.ended_at) {
        const start = new Date(session.created_at);
        const end = new Date(session.ended_at);
        const diffMs = end - start;
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 60) {
          duration = `${diffMins} min`;
        } else {
          const hours = Math.floor(diffMins / 60);
          const mins = diffMins % 60;
          duration = mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
        }
      }
      return { ...session, duration };
    });

    return {
      data: sessionsWithDuration,
      pagination: {
        page,
        limit,
        total: Number(total.total),
      },
    };
  }
}

module.exports = new GameService();
