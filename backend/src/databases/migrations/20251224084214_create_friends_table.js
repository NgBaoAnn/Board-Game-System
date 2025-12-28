/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.createTable("friends", (table) => {
    table.uuid("id").primary();

    table
      .uuid("user_a")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .uuid("user_b")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.string("status");
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table.unique(["user_a", "user_b"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("friends");
};
