/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.createTable("roles", (table) => {
    table.integer("id").primary();
    table
      .enu("name", ["admin", "user"], {
        useNative: true,
        enumName: "role_enum",
      })
      .notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("roles").then(() => {
    return knex.raw('DROP TYPE IF EXISTS "role_enum"');
  });
};
