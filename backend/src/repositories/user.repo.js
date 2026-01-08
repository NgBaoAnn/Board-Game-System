const db = require("../databases/knex");
const MODULE = require("../constants/module");

class UserRepo {
  findAll({ offset = 0, limit = 10, search = '', role = '', active = null } = {}) {
    const query = db({ u: MODULE.USER })
      .leftJoin({ r: MODULE.ROLE }, "u.role_id", "r.id")
      .select(
        "u.id",
        "u.email",
        "u.username",
        "u.avatar_url",
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

    // Apply search filter
    if (search) {
      query.where(function () {
        this.where('u.username', 'ilike', `%${search}%`)
          .orWhere('u.email', 'ilike', `%${search}%`)
          .orWhereRaw("CAST(u.id AS TEXT) ILIKE ?", [`%${search}%`]);
      });
    }

    // Apply role filter
    if (role && role !== 'all') {
      query.where('r.name', role);
    }

    // Apply active filter
    if (active !== null && active !== 'all') {
      query.where('u.active', active === 'true' || active === true);
    }

    return query.limit(limit).offset(offset);
  }
  countAll({ search = '', role = '', active = null } = {}) {
    const query = db({ u: MODULE.USER })
      .leftJoin({ r: MODULE.ROLE }, "u.role_id", "r.id")
      .count("* as total");

    // Apply search filter
    if (search) {
      query.where(function () {
        this.where('u.username', 'ilike', `%${search}%`)
          .orWhere('u.email', 'ilike', `%${search}%`)
          .orWhereRaw("CAST(u.id AS TEXT) ILIKE ?", [`%${search}%`]);
      });
    }

    // Apply role filter
    if (role && role !== 'all') {
      query.where('r.name', role);
    }

    // Apply active filter
    if (active !== null && active !== 'all') {
      query.where('u.active', active === 'true' || active === true);
    }

    return query.first();
  }

  findById(id) {
    return db({ u: MODULE.USER })
      .leftJoin({ r: MODULE.ROLE }, "u.role_id", "r.id")
      .select(
        "u.id",
        "u.email",
        "u.username",
        "u.avatar_url",
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

  async getUserCounts() {
    const result = await db({ u: MODULE.USER })
      .leftJoin({ r: MODULE.ROLE }, "u.role_id", "r.id")
      .select(
        db.raw("COUNT(*) as total_users"),
        db.raw("COUNT(CASE WHEN r.name = 'user' THEN 1 END) as total_players"),
        db.raw("COUNT(CASE WHEN DATE(u.created_at) = CURRENT_DATE THEN 1 END) as total_users_created_today"),
        db.raw("COUNT(CASE WHEN u.active = false THEN 1 END) as total_banned")
      )
      .first();

    return {
      totalUsers: parseInt(result.total_users) || 0,
      totalPlayers: parseInt(result.total_players) || 0,
      totalUsersCreatedToday: parseInt(result.total_users_created_today) || 0,
      totalBanned: parseInt(result.total_banned) || 0,
    };
  }
}

module.exports = new UserRepo();
