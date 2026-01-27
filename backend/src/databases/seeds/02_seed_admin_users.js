const passwordService = require("../../services/password.service");

exports.seed = async function (knex) {
  await knex("users")
    .whereIn("email", [
      "admin1@gmail.com",
      "admin2@gmail.com",
      "admin3@gmail.com",
      "admin4@gmail.com",
      "admin5@gmail.com",
    ])
    .del();

  const passwordHashed = await passwordService.hash("123456@");

  await knex("users").insert([
    {
      email: "admin1@gmail.com",
      username: "admin1",
      password: passwordHashed,
      role_id: 1,
    },
    {
      email: "admin2@gmail.com",
      username: "admin2",
      password: passwordHashed,
      role_id: 1,
    },
    {
      email: "admin3@gmail.com",
      username: "admin3",
      password: passwordHashed,
      role_id: 1,
    },
    {
      email: "admin4@gmail.com",
      username: "admin4",
      password: passwordHashed,
      role_id: 1,
    },
    {
      email: "admin5@gmail.com",
      username: "admin5",
      password: passwordHashed,
      role_id: 1,
    },
  ]);
};
