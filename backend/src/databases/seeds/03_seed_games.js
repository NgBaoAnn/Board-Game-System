const { GAME_TYPES } = require("../../constants/game.constants");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("games").del();

  // Insert games
  await knex("games").insert([
    {
      code: GAME_TYPES.TIC_TAC_TOE,
      name: "Tic Tac Toe",
      description: "Classic 3x3 Tic Tac Toe game. Get 3 in a row to win!",
      is_active: true,
      board_row: 3,
      board_col: 3,
    },
    {
      code: GAME_TYPES.CARO_4,
      name: "Caro 4",
      description: "Caro game with 4-in-a-row win condition on a larger board.",
      is_active: true,
      board_row: 10,
      board_col: 10,
    },
    {
      code: GAME_TYPES.CARO_5,
      name: "Caro 5",
      description:
        "Caro game with 5-in-a-row win condition. Classic Gomoku rules.",
      is_active: true,
      board_row: 15,
      board_col: 15,
    },
    {
      code: GAME_TYPES.SNAKE,
      name: "Snake",
      description:
        "Classic Snake game. Eat food to grow and avoid hitting walls or yourself!",
      is_active: true,
      board_row: 20,
      board_col: 20,
    },
    {
      code: GAME_TYPES.MATCH_3,
      name: "Match 3",
      description:
        "Match 3 or more identical items to score points. Strategic puzzle game.",
      is_active: true,
      board_row: 8,
      board_col: 8,
    },
    {
      code: GAME_TYPES.MEMORY,
      name: "Memory",
      description:
        "Flip cards to find matching pairs. Test your memory skills!",
      is_active: true,
      board_row: 4,
      board_col: 4,
    },
    {
      code: GAME_TYPES.FREE_DRAW,
      name: "Free Draw",
      description:
        "Create pixel art on a white canvas. Express your creativity!",
      is_active: true,
      board_row: 20,
      board_col: 20,
    },
  ]);
};
