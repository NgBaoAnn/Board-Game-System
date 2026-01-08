/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("user_achievements", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));

    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .uuid("achievement_id")
      .notNullable()
      .references("id")
      .inTable("achievements")
      .onDelete("CASCADE");

    table.timestamp("achieved_at").defaultTo(knex.fn.now());

    // Unique constraint: one achievement per user
    table.unique(["user_id", "achievement_id"]);

    // Indexes for faster lookup
    table.index("user_id");
    table.index("achievement_id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("user_achievements");
};
