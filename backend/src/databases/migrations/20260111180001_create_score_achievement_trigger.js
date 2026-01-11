/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.raw(`
    -- Function to automatically grant achievements based on best score
    CREATE OR REPLACE FUNCTION auto_grant_score_achievements()
    RETURNS TRIGGER AS $$
    DECLARE
      achievement_record RECORD;
    BEGIN
      -- Loop through all score-based achievements for this game
      FOR achievement_record IN
        SELECT id, condition_value
        FROM achievements
        WHERE game_id = NEW.game_id
        AND condition_type = 'score'
      LOOP
        -- Check if best score meets or exceeds the achievement requirement
        IF NEW.best_score >= achievement_record.condition_value THEN
          -- Insert user achievement if not already exists
          INSERT INTO user_achievements (user_id, achievement_id, achieved_at)
          VALUES (NEW.user_id, achievement_record.id, NOW())
          ON CONFLICT (user_id, achievement_id) DO NOTHING;
        END IF;
      END LOOP;
      
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Create trigger on game_best_scores table
    -- Fires after INSERT or UPDATE of best_score column
    CREATE TRIGGER trigger_auto_grant_achievements
    AFTER INSERT OR UPDATE OF best_score ON game_best_scores
    FOR EACH ROW
    EXECUTE FUNCTION auto_grant_score_achievements();
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw(`
    -- Drop trigger first
    DROP TRIGGER IF EXISTS trigger_auto_grant_achievements ON game_best_scores;
    
    -- Drop function
    DROP FUNCTION IF EXISTS auto_grant_score_achievements();
  `);
};
