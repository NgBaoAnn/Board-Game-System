/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries in achievements table
  await knex("achievements").del();

  // Get all games to create achievements for each
  const games = await knex("games").select("id", "code", "name");

  const achievements = [];

  // Create achievements for each game with 200 score milestone
  for (const game of games) {
    achievements.push({
      code: `${game.code.toUpperCase()}_NOVICE`,
      name: `${game.name} Novice`,
      description: `Score 200 points in ${game.name}`,
      game_id: game.id,
      condition_type: "score",
      condition_value: 200,
      icon: "🏆",
    });

    achievements.push({
      code: `${game.code.toUpperCase()}_SKILLED`,
      name: `${game.name} Skilled`,
      description: `Score 500 points in ${game.name}`,
      game_id: game.id,
      condition_type: "score",
      condition_value: 500,
      icon: "🥇",
    });

    achievements.push({
      code: `${game.code.toUpperCase()}_EXPERT`,
      name: `${game.name} Expert`,
      description: `Score 1000 points in ${game.name}`,
      game_id: game.id,
      condition_type: "score",
      condition_value: 1000,
      icon: "👑",
    });

    achievements.push({
      code: `${game.code.toUpperCase()}_MASTER`,
      name: `${game.name} Master`,
      description: `Score 2000 points in ${game.name}`,
      game_id: game.id,
      condition_type: "score",
      condition_value: 2000,
      icon: "💎",
    });

    achievements.push({
      code: `${game.code.toUpperCase()}_LEGEND`,
      name: `${game.name} Legend`,
      description: `Score 5000 points in ${game.name}`,
      game_id: game.id,
      condition_type: "score",
      condition_value: 5000,
      icon: "⭐",
    });
  }

  // Insert all achievements
  await knex("achievements").insert(achievements);
};
