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
      .limit(limit)
      .offset(offset);
  }
  countAll() {
    return db(MODULE.USER).count("* as total").first();
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
}

module.exports = new UserRepo();
