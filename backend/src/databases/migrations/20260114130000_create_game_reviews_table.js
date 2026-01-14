/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("game_reviews", (table) => {
        table.increments("id").primary();

        table.uuid("user_id").notNullable();
        table.integer("game_id").unsigned().notNullable();
        table.integer("rating").notNullable();
        table.text("comment").notNullable();

        table.timestamps(true, true);

        // Foreign keys
        table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
        table.foreign("game_id").references("id").inTable("games").onDelete("CASCADE");

        // Each user can only review a game once
        table.unique(["user_id", "game_id"]);

        // Indexes for faster queries
        table.index("game_id");
        table.index("user_id");
        table.index("rating");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists("game_reviews");
};
