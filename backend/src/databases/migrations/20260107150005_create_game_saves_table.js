/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("game_saves", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));

    table
      .uuid("session_id")
      .notNullable()
      .references("id")
      .inTable("game_sessions")
      .onDelete("CASCADE");

    table.json("save_state");
    table.timestamp("saved_at").defaultTo(knex.fn.now());

    // Index for faster save lookup
    table.index("session_id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("game_saves");
};
