const GAME_SESSION_STATUS = Object.freeze({
  PLAYING: "playing",
  PAUSED: "paused",
  FINISHED: "finished",
});

const GAME_SESSION_STATUS_VALUES = Object.values(GAME_SESSION_STATUS);

module.exports = {
  GAME_SESSION_STATUS,
  GAME_SESSION_STATUS_VALUES,
};
