const ACHIEVEMENT_CONDITION_TYPE = Object.freeze({
  SCORE: "score",
  PLAY_COUNT: "play_count",
  TIME: "time",
  WIN_COUNT: "win_count",
});

const ACHIEVEMENT_CONDITION_TYPE_VALUES = Object.values(
  ACHIEVEMENT_CONDITION_TYPE
);

module.exports = {
  ACHIEVEMENT_CONDITION_TYPE,
  ACHIEVEMENT_CONDITION_TYPE_VALUES,
};
