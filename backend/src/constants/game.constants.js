const GAME_TYPES = Object.freeze({
  TIC_TAC_TOE: "tic_tac_toe",
  CARO_4: "caro_4",
  CARO_5: "caro_5",
  SNAKE: "snake",
  MATCH_3: "match_3",
  MEMORY: "memory",
  FREE_DRAW: "free_draw",
});

const GAME_CONFIG = Object.freeze({
  tic_tac_toe: {
    name: "Tic Tac Toe",
    maxScore: 100,
  },
  caro_4: {
    name: "Caro 4",
    maxScore: 5000,
  },
  caro_5: {
    name: "Caro 5",
    maxScore: 5000,
  },
  snake: {
    name: "Snake",
    maxScore: 10000,
  },
  match_3: {
    name: "Match 3",
    maxScore: 10000,
  },
  memory: {
    name: "Memory",
    maxScore: 200,
  },
  free_draw: {
    name: "Free Draw",
    maxScore: 1000,
  },
});

const SUPPORTED_GAMES = Object.keys(GAME_CONFIG);

module.exports = {
  GAME_TYPES,
  GAME_CONFIG,
  SUPPORTED_GAMES,
};
