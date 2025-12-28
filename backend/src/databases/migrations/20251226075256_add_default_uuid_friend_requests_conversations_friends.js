/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  // đảm bảo extension uuid tồn tại
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

  // friend_requests
  await knex.raw(`
    ALTER TABLE friend_requests
    ALTER COLUMN id SET DEFAULT uuid_generate_v4()
  `);

  // friends
  await knex.raw(`
    ALTER TABLE friends
    ALTER COLUMN id SET DEFAULT uuid_generate_v4()
  `);

  // conversations
  await knex.raw(`
    ALTER TABLE conversations
    ALTER COLUMN id SET DEFAULT uuid_generate_v4()
  `);
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  await knex.raw(`
    ALTER TABLE friend_requests
    ALTER COLUMN id DROP DEFAULT
  `);

  await knex.raw(`
    ALTER TABLE friends
    ALTER COLUMN id DROP DEFAULT
  `);

  await knex.raw(`
    ALTER TABLE conversations
    ALTER COLUMN id DROP DEFAULT
  `);
};
