/**
 * @param {import("knex").Knex} knex
 */
exports.seed = async function (knex) {
  // Clear existing scores data
  await knex("scores").del();

  // Insert seed data for all game types
  await knex("scores").insert([
    // tic_tac_toe - 5 records
    { user_id: null, game_type: "tic_tac_toe", score: 100 },
    { user_id: null, game_type: "tic_tac_toe", score: 95 },
    { user_id: null, game_type: "tic_tac_toe", score: 85 },
    { user_id: null, game_type: "tic_tac_toe", score: 75 },
    { user_id: null, game_type: "tic_tac_toe", score: 60 },

    // caro_4 - 5 records
    { user_id: null, game_type: "caro_4", score: 2500 },
    { user_id: null, game_type: "caro_4", score: 2200 },
    { user_id: null, game_type: "caro_4", score: 1800 },
    { user_id: null, game_type: "caro_4", score: 1400 },
    { user_id: null, game_type: "caro_4", score: 900 },

    // caro_5 - 5 records
    { user_id: null, game_type: "caro_5", score: 3500 },
    { user_id: null, game_type: "caro_5", score: 3100 },
    { user_id: null, game_type: "caro_5", score: 2600 },
    { user_id: null, game_type: "caro_5", score: 2000 },
    { user_id: null, game_type: "caro_5", score: 1500 },

    // snake - 5 records
    { user_id: null, game_type: "snake", score: 5000 },
    { user_id: null, game_type: "snake", score: 4200 },
    { user_id: null, game_type: "snake", score: 3500 },
    { user_id: null, game_type: "snake", score: 2800 },
    { user_id: null, game_type: "snake", score: 1900 },

    // match_3 - 5 records
    { user_id: null, game_type: "match_3", score: 8500 },
    { user_id: null, game_type: "match_3", score: 7200 },
    { user_id: null, game_type: "match_3", score: 5900 },
    { user_id: null, game_type: "match_3", score: 4500 },
    { user_id: null, game_type: "match_3", score: 3100 },

    // memory - 5 records
    { user_id: null, game_type: "memory", score: 120 },
    { user_id: null, game_type: "memory", score: 105 },
    { user_id: null, game_type: "memory", score: 90 },
    { user_id: null, game_type: "memory", score: 75 },
    { user_id: null, game_type: "memory", score: 55 },

    // free_draw - 5 records
    { user_id: null, game_type: "free_draw", score: 500 },
    { user_id: null, game_type: "free_draw", score: 450 },
    { user_id: null, game_type: "free_draw", score: 380 },
    { user_id: null, game_type: "free_draw", score: 300 },
    { user_id: null, game_type: "free_draw", score: 200 },
  ]);
};
