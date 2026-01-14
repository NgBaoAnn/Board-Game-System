/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const MODULE = require("../../constants/module");

exports.seed = async function (knex) {
    try {
        console.log("Starting Seed 08 (Game Sessions)...");

        // Clear existing game sessions
        await knex(MODULE.GAME_SESSION).del();

        const users = await knex(MODULE.USER).select("id");
        const games = await knex(MODULE.GAME).select("id");

        if (users.length === 0 || games.length === 0) {
            console.log("No users or games found for session seeding");
            return;
        }

        const sessions = [];
        const now = new Date();

        // Generate for last 30 days
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            // Random 10 to 30 sessions per day
            const count = Math.floor(Math.random() * 21) + 10; // 10-30

            for (let j = 0; j < count; j++) {
                const user = users[Math.floor(Math.random() * users.length)];
                const game = games[Math.floor(Math.random() * games.length)];

                // Random times
                const createdTimestamp = new Date(date);
                createdTimestamp.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

                // Duration 5-60 mins
                const durationParams = Math.floor(Math.random() * 55) + 5;
                const endedTimestamp = new Date(createdTimestamp.getTime() + durationParams * 60000);

                // Random score 50-200
                const score = Math.floor(Math.random() * 151) + 50;

                sessions.push({
                    user_id: user.id,
                    game_id: game.id,
                    status: "finished",
                    final_score: score,
                    created_at: createdTimestamp,
                    ended_at: endedTimestamp,
                    updated_at: endedTimestamp // updated at end
                });
            }
        }

        // Insert in chunks
        if (sessions.length > 0) {
            const chunkSize = 100;
            for (let i = 0; i < sessions.length; i += chunkSize) {
                await knex(MODULE.GAME_SESSION).insert(sessions.slice(i, i + chunkSize));
            }
        }
        console.log(`Seed 08 completed: ${sessions.length} sessions created`);

    } catch (error) {
        console.error("Seed 08 Error:", error);
        throw error;
    }
};
