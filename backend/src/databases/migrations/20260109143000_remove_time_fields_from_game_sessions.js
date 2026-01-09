/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("game_sessions", (table) => {
    table.dropColumn("time_limit_seconds");
    table.dropColumn("time_remaining_seconds");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("game_sessions", (table) => {
    table.integer("time_limit_seconds");
    table.integer("time_remaining_seconds");
  });
};
