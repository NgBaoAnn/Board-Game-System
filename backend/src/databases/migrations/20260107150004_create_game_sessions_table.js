/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("game_sessions", (table) => {
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

    table
      .enu("status", ["playing", "paused", "finished"], {
        useNative: true,
        enumName: "game_session_status_enum",
      })
      .notNullable();

    table.integer("time_limit_seconds");
    table.integer("time_remaining_seconds");
    table.integer("final_score");
    table.timestamp("ended_at");

    table.timestamps(true, true);

    // Indexes for faster lookup
    table.index("user_id");
    table.index("game_id");
    table.index("status");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("game_sessions").then(() => {
    return knex.raw('DROP TYPE IF EXISTS "game_session_status_enum"');
  });
};
