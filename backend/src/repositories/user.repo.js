const db = require("../databases/knex");
const MODULE = require("../constants/module");

class UserRepo {
  findAll({ offset = 0, limit = 10, search, role, active } = {}) {
    let query = db({ u: MODULE.USER })
      .leftJoin({ r: MODULE.ROLE }, "u.role_id", "r.id")
      .select(
        "u.id",
        "u.email",
        "u.username",
        "u.avatar_url",
        "u.phone",
        "u.bio",
        "u.location",
        "u.active",
        "u.created_at",
        "u.updated_at",
        db.raw(`
        json_build_object(
          'id', r.id,
          'name', r.name
        ) as role
      `)
      );

    // Apply filters
    if (search) {
      query = query.where(function () {
        this.where("u.username", "ilike", `%${search}%`).orWhere(
          "u.email",
          "ilike",
          `%${search}%`
        );
      });
    }

    if (role) {
      query = query.where("r.name", role);
    }

    if (active !== undefined && active !== "") {
      query = query.where("u.active", active === "true");
    }

    return query.limit(limit).offset(offset).orderBy("u.created_at", "desc");
  }

  countAll({ search, role, active } = {}) {
    let query = db({ u: MODULE.USER }).leftJoin(
      { r: MODULE.ROLE },
      "u.role_id",
      "r.id"
    );

    // Apply same filters
    if (search) {
      query = query.where(function () {
        this.where("u.username", "ilike", `%${search}%`).orWhere(
          "u.email",
          "ilike",
          `%${search}%`
        );
      });
    }

    if (role) {
      query = query.where("r.name", role);
    }

    if (active !== undefined && active !== "") {
      query = query.where("u.active", active === "true");
    }

    return query.count("* as total").first();
  }

  findById(id) {
    return db({ u: MODULE.USER })
      .leftJoin({ r: MODULE.ROLE }, "u.role_id", "r.id")
      .select(
        "u.id",
        "u.email",
        "u.username",
        "u.avatar_url",
        "u.phone",
        "u.bio",
        "u.location",
        "u.active",
        "u.created_at",
        "u.updated_at",
        db.raw(`
        json_build_object(
          'id', r.id,
          'name', r.name
        ) as role
      `)
      )
      .where("u.id", id)
      .first();
  }

  findByEmail(email) {
    return db({ u: MODULE.USER })
      .leftJoin({ r: MODULE.ROLE }, "u.role_id", "r.id")
      .select(
        "u.id",
        "u.email",
        "u.username",
        "u.password",
        "u.avatar_url",
        "u.phone",
        "u.bio",
        "u.location",
        "u.active",
        "u.created_at",
        "u.updated_at",
        db.raw(`
        json_build_object(
          'id', r.id,
          'name', r.name
        ) as role
      `)
      )
      .where("u.email", email)
      .first();
  }

  async create(data) {
    const [user] = await db(MODULE.USER).insert(data).returning(["id"]);

    return this.findById(user.id);
  }

  update(id, data) {
    return db(MODULE.USER)
      .where({ id })
      .update(data)
      .returning("*")
      .then(([user]) => user);
  }

  remove(id) {
    return db(MODULE.USER).where({ id }).del();
  }

  saveResetOtp(id, otp, minutesValid = 5) {
    return db(MODULE.USER)
      .where({ id })
      .update({
        reset_otp: otp,
        reset_otp_expires_at: db.raw(
          `NOW() + INTERVAL '${minutesValid} minutes'`
        ),
      });
  }

  findByResetOtp(email, otp) {
    return db(MODULE.USER)
      .where({ email, reset_otp: otp })
      .where("reset_otp_expires_at", ">", db.fn.now())
      .first();
  }

  clearResetOtp(id) {
    return db(MODULE.USER).where({ id }).update({
      reset_otp: null,
      reset_otp_expires_at: null,
    });
  }

  saveResetToken(id, token, minutesValid = 15) {
    return db(MODULE.USER)
      .where({ id })
      .update({
        reset_token: token,
        reset_token_expires_at: db.raw(
          `NOW() + INTERVAL '${minutesValid} minutes'`
        ),
        reset_otp: null,
        reset_otp_expires_at: null,
      });
  }

  findByResetToken(token) {
    return db(MODULE.USER)
      .where({ reset_token: token })
      .where("reset_token_expires_at", ">", db.fn.now())
      .first();
  }

  updatePassword(id, hashedPassword) {
    return db(MODULE.USER).where({ id }).update({
      password: hashedPassword,
      reset_token: null,
      reset_token_expires_at: null,
    });
  }
  
  async getUserCounts(startDate, endDate) {
    let usersCreatedQuery;
    let bindings = [];

    if (startDate && endDate) {
      usersCreatedQuery = `
      SUM(
        CASE
          WHEN u.created_at >= ?
          AND u.created_at < ?
          THEN 1 ELSE 0
        END
      ) as total_users_created_today
    `;
      bindings = [startDate, endDate];
    } else {
      usersCreatedQuery = `
      SUM(
        CASE
          WHEN u.created_at >= CURRENT_DATE
          AND u.created_at < CURRENT_DATE + INTERVAL '1 day'
          THEN 1 ELSE 0
        END
      ) as total_users_created_today
    `;
    }

    const result = await db({ u: MODULE.USER })
      .leftJoin({ r: MODULE.ROLE }, "u.role_id", "r.id")
      .select(
        db.raw("COUNT(DISTINCT u.id) as total_users"),
        db.raw("SUM(CASE WHEN r.name = 'user' THEN 1 ELSE 0 END) as total_players"),
        db.raw(usersCreatedQuery, bindings),
        db.raw("SUM(CASE WHEN u.active = false THEN 1 ELSE 0 END) as total_banned")
      )
      .first();

    return {
      totalUsers: Number(result?.total_users ?? 0),
      totalPlayers: Number(result?.total_players ?? 0),
      totalUsersCreatedToday: Number(result?.total_users_created_today ?? 0),
      totalBanned: Number(result?.total_banned ?? 0),
    };
  }


  async getUserRegistrations() {
    // Get user registrations for the last 6 months
    const now = new Date();
    const startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - 5);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const results = await db(MODULE.USER)
      .select(db.raw("EXTRACT(MONTH FROM created_at)::integer as month"))
      .count("id as count")
      .where("created_at", ">=", startDate)
      .groupByRaw("EXTRACT(MONTH FROM created_at)")
      .orderByRaw("EXTRACT(MONTH FROM created_at)");

    // Convert to the expected format { "month": count }
    const stats = {};
    results.forEach((row) => {
      stats[row.month.toString()] = parseInt(row.count);
    });

    return stats;
  }

  async countTotalPlayers(beforeDate) {
    let query = db({ u: MODULE.USER })
      .leftJoin({ r: MODULE.ROLE }, "u.role_id", "r.id")
      .where("r.name", "user");

    if (beforeDate) {
      query = query.where("u.created_at", "<", beforeDate);
    }

    const result = await query.count("u.id as total").first();
    return parseInt(result.total) || 0;
  }

  async countNewUsers(startDate, endDate) {
    let query = db(MODULE.USER);

    if (startDate) {
      query = query.where("created_at", ">=", startDate);
    }
    if (endDate) {
      query = query.where("created_at", "<", endDate);
    }

    const result = await query.count("id as total").first();
    return parseInt(result.total) || 0;
  }

  async getUserRegistrationStats(filter) {
    const now = new Date();
    let startDate;
    let stats = {};

    if (filter === "7d" || !filter) {
      // Last 7 days
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);

      // Initialize
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const day = date.getDate();
        stats[day.toString()] = 0;
      }

      const results = await db(MODULE.USER)
        .select(db.raw("EXTRACT(DAY FROM created_at)::integer as period"))
        .count("id as count")
        .where("created_at", ">=", startDate)
        .groupByRaw("EXTRACT(DAY FROM created_at)")
        .orderByRaw("EXTRACT(DAY FROM created_at)");

      results.forEach((row) => {
        stats[row.period.toString()] = parseInt(row.count);
      });
    } else if (filter === "30d") {
      // Last 30 days
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);

      for (let i = 0; i < 30; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const day = date.getDate();
        stats[day.toString()] = 0;
      }

      const results = await db(MODULE.USER)
        .select(db.raw("EXTRACT(DAY FROM created_at)::integer as period"))
        .count("id as count")
        .where("created_at", ">=", startDate)
        .groupByRaw("EXTRACT(DAY FROM created_at)")
        .orderByRaw("EXTRACT(DAY FROM created_at)");

      results.forEach((row) => {
        stats[row.period.toString()] = parseInt(row.count);
      });
    } else if (filter === "6m") {
      // Last 6 months
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 5);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);

      for (let i = 0; i < 6; i++) {
        const date = new Date(startDate);
        date.setMonth(startDate.getMonth() + i);
        const month = date.getMonth() + 1;
        stats[month.toString()] = 0;
      }

      const results = await db(MODULE.USER)
        .select(db.raw("EXTRACT(MONTH FROM created_at)::integer as period"))
        .count("id as count")
        .where("created_at", ">=", startDate)
        .groupByRaw("EXTRACT(MONTH FROM created_at)")
        .orderByRaw("EXTRACT(MONTH FROM created_at)");

      results.forEach((row) => {
        stats[row.period.toString()] = parseInt(row.count);
      });
    }
    return stats;
  }

  async getUserStats(userId) {
    // Get user's total score (sum of all best scores across all games)
    const scoreResult = await db(MODULE.GAME_BEST_SCORE)
      .where("user_id", userId)
      .sum("best_score as total_score")
      .first();

    const totalScore = Number(scoreResult?.total_score) || 0;

    // Calculate global rank based on total score
    // Get all users' total scores and find position
    const allScores = await db(MODULE.GAME_BEST_SCORE)
      .select("user_id")
      .sum("best_score as total_score")
      .groupBy("user_id")
      .orderBy("total_score", "desc");

    let globalRank = 0;
    for (let i = 0; i < allScores.length; i++) {
      if (allScores[i].user_id === userId) {
        globalRank = i + 1;
        break;
      }
    }

    // If user has no scores, rank is 0 (unranked)
    if (totalScore === 0) {
      globalRank = 0;
    }

    // Get games played count
    const gamesPlayedResult = await db(MODULE.GAME_BEST_SCORE)
      .where("user_id", userId)
      .count("* as count")
      .first();

    return {
      totalScore,
      globalRank,
      gamesPlayed: Number(gamesPlayedResult?.count) || 0,
    };
  }
}

module.exports = new UserRepo();
