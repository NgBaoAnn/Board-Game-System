const db = require("../databases/knex");
const MODULE = require("../constants/module");

class UserRepo {
  findAll({ offset = 0, limit = 10 } = {}) {
    return db({ u: MODULE.USER })
      .leftJoin({ r: MODULE.ROLE }, "u.role_id", "r.id")
      .select(
        "u.id",
        "u.email",
        "u.username",
        "u.avatar_url",
        "u.status",
        "u.created_at",
        "u.updated_at",
        db.raw(`
        json_build_object(
          'id', r.id,
          'name', r.name
        ) as role
      `)
      )
      .limit(limit)
      .offset(offset);
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
        "u.status",
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
}

module.exports = new UserRepo();
