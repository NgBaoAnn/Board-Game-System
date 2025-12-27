/**
 * @param {import("knex").Knex} knex
 */
exports.seed = async function (knex) {
  // Delete users first to avoid foreign key constraint violation
  await knex("users").del();
  
  // Then delete roles
  await knex("roles").whereIn("id", [1, 2]).del();

  await knex("roles").insert([
    {
      id: 1,
      name: "admin",
    },
    {
      id: 2,
      name: "user",
    },
  ]);
};
