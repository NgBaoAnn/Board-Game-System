/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("game_best_scores", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));

    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .integer("game_id")
      .notNullable()
      .references("id")
      .inTable("games")
      .onDelete("CASCADE");

    table.integer("best_score").notNullable();
    table.timestamp("achieved_at").defaultTo(knex.fn.now());

    // Unique constraint: one best score per user per game
    table.unique(["user_id", "game_id"]);

    // Indexes for leaderboard queries
    table.index("user_id");
    table.index("game_id");
    table.index(["game_id", "best_score"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("game_best_scores");
};
