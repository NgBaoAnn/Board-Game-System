/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.alterTable("conversations", (table) => {
    table.text("last_message").nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.alterTable("conversations", (table) => {
    table.dropColumn("last_message");
  });
};
