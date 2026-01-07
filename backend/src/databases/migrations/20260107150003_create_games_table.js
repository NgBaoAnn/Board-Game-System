/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("games", (table) => {
    table.increments("id").primary();

    table.string("code").unique().notNullable();
    table.boolean("is_active").defaultTo(true);
    table.string("name").notNullable();
    table.text("description");
    table.integer("board_row");
    table.integer("board_col");

    // Index for faster game lookup by code
    table.index("code");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("games");
};
