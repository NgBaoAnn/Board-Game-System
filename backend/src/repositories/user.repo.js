const db = require("../databases/knex");
const MODULE = require("../constants/module");

class UserRepo {
  findAll({ offset, limit } = {}) {
    return db(MODULE.USER).select("*").limit(limit).offset(offset);
  }

  findById(id) {
    return db(MODULE.USER).where({ id }).first();
  }

  findByEmail(email) {
    return db(MODULE.USER).where({ email }).first();
  }

  create(data) {
    return db(MODULE.USER)
      .insert(data)
      .returning("*")
      .then(([user]) => user);
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
