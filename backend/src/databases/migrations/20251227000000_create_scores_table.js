/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("scores", (table) => {
    table.increments("id").primary();

    table
      .uuid("user_id")
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.string("game_type").notNullable();
    table.integer("score").notNullable();

    table.timestamps(true, true);

    // Index on game_type
    table.index("game_type");

    // Composite index on (game_type, score)
    table.index(["game_type", "score"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("scores");
};
