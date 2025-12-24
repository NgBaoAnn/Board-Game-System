/**
 * @param {import("knex").Knex} knex
 */
exports.seed = async function (knex) {
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
