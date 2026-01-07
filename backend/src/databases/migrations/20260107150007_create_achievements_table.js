/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("achievements", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));

    table.string("code").unique().notNullable();
    table.string("name").notNullable();
    table.text("description");

    table
      .integer("game_id")
      .notNullable()
      .references("id")
      .inTable("games")
      .onDelete("CASCADE");

    table
      .enu("condition_type", ["score", "play_count", "time", "win_count"], {
        useNative: true,
        enumName: "achievement_condition_type_enum",
      })
      .notNullable();

    table.integer("condition_value").notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());

    // Index for faster lookup
    table.index("code");
    table.index("game_id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("achievements").then(() => {
    return knex.raw('DROP TYPE IF EXISTS "achievement_condition_type_enum"');
  });
};
