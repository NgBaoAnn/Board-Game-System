/**
 * Add is_read column to messages table for read/unread tracking
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("messages", (table) => {
    // Read status - false means unread by recipient
    table.boolean("is_read").defaultTo(false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("messages", (table) => {
    table.dropColumn("is_read");
  });
};
