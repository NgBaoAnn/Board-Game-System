/**
 * Add reaction column to messages table
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("messages", (table) => {
    // Reaction emoji (e.g., ❤️, 😂, 🎮, 👍, 🔥, 👏)
    table.string("reaction", 10).nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("messages", (table) => {
    table.dropColumn("reaction");
  });
};
