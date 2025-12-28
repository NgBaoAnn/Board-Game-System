exports.up = async function (knex) {
  await knex.schema.alterTable("friends", (table) => {
    table.unique(["user_a", "user_b"], "unique_friend_pair");
  });

  await knex.schema.alterTable("friend_requests", (table) => {
    table.index(["from", "to"], "idx_friend_requests_from_to");
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("friends", (table) => {
    table.dropUnique(["user_a", "user_b"], "unique_friend_pair");
  });

  await knex.schema.alterTable("friend_requests", (table) => {
    table.dropIndex(["from", "to"], "idx_friend_requests_from_to");
  });
};
