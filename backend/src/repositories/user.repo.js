const db = require("../databases/knex");
const MODULE = require("../constants/module");

class UserRepo {
  findAll() {
    return db(MODULE.USER).select("*");
  }

  findById(id) {
    return db(MODULE.USER).where({ id }).first();
  }

  findByEmail(email) {
    return db(MODULE.USER).where({ email }).first();
  }

  create(data) {
    return db(MODULE.USER).insert(data).returning("*");
  }

  update(id, data) {
    return db(MODULE.USER).where({ id }).update(data).returning("*");
  }

  remove(id) {
    return db(MODULE.USER).where({ id }).del();
  }
}

module.exports = new UserRepo();
