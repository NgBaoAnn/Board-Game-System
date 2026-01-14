/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const MODULE = require("../../constants/module");

exports.seed = async function (knex) {
    // Clear existing user achievements
    await knex(MODULE.USER_ACHIEVEMENT).del();

    const adminRole = await knex(MODULE.ROLE).where("name", "admin").first();
    const users = await knex(MODULE.USER)
        .whereNot("role_id", adminRole.id)
        .select("id", "created_at");

    const games = await knex(MODULE.GAME).select("id");

    // Fetch all achievements grouped by game
    const allAchievements = await knex(MODULE.ACHIEVEMENT).select("id", "game_id");

    if (users.length === 0 || allAchievements.length === 0) return;

    const userAchievements = [];

    for (const user of users) {
        for (const game of games) {
            // Get achievements for this game
            const gameAchievements = allAchievements.filter(a => a.game_id === game.id);

            if (gameAchievements.length === 0) continue;

            // Random 0 to 3 achievements per game per user
            const count = Math.floor(Math.random() * 4); // 0,1,2,3

            // Shuffle achievements
            const shuffled = [...gameAchievements].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, count);

            for (const ach of selected) {
                // Time logic: Achieved after user creation, within last 30 days essentially
                const userCreated = new Date(user.created_at);
                const now = new Date();
                const timeSpan = now.getTime() - userCreated.getTime();
                const randomTime = Math.random() * timeSpan;
                const achievedAt = new Date(userCreated.getTime() + randomTime);

                userAchievements.push({
                    user_id: user.id,
                    achievement_id: ach.id,
                    achieved_at: achievedAt
                });
            }
        }
    }

    // Insert in chunks
    if (userAchievements.length > 0) {
        const chunkSize = 100;
        for (let i = 0; i < userAchievements.length; i += chunkSize) {
            await knex(MODULE.USER_ACHIEVEMENT).insert(userAchievements.slice(i, i + chunkSize));
        }
    }
};
