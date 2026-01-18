/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const MODULE = require("../../constants/module");

exports.seed = async function (knex) {
    try {
        console.log("Starting Seed 11 (Game Best Scores)...");

        // Clear existing best scores
        await knex(MODULE.GAME_BEST_SCORE).del();

        // Get best score for each user-game combo from game_sessions
        const bestScores = await knex(MODULE.GAME_SESSION)
            .select(
                "user_id",
                "game_id",
                knex.raw("MAX(final_score) as best_score"),
                knex.raw("MAX(ended_at) as achieved_at")
            )
            .where("status", "finished")
            .whereNotNull("final_score")
            .groupBy("user_id", "game_id");

        if (bestScores.length === 0) {
            console.log("No finished game sessions found for best scores seeding");
            return;
        }

        const now = new Date();
        const records = bestScores.map(score => ({
            user_id: score.user_id,
            game_id: score.game_id,
            best_score: score.best_score,
            achieved_at: score.achieved_at || now
        }));

        // Insert in chunks
        const chunkSize = 100;
        for (let i = 0; i < records.length; i += chunkSize) {
            await knex(MODULE.GAME_BEST_SCORE).insert(records.slice(i, i + chunkSize));
        }

        console.log(`Seed 11 completed: ${records.length} best scores created`);

    } catch (error) {
        console.error("Seed 11 Error:", error);
        throw error;
    }
};
