/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.string("reset_otp");
    table.timestamp("reset_otp_expires_at");
    table.string("reset_token");
    table.timestamp("reset_token_expires_at");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.dropColumn("reset_otp");
    table.dropColumn("reset_otp_expires_at");
    table.dropColumn("reset_token");
    table.dropColumn("reset_token_expires_at");
  });
};
