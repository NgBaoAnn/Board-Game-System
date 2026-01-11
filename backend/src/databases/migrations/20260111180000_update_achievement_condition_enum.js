/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.raw(`
    -- Update existing achievements to 'score' if they have other types
    UPDATE achievements 
    SET condition_type = 'score' 
    WHERE condition_type IN ('play_count', 'time', 'win_count');
    
    -- Drop the old enum and recreate with only 'score'
    ALTER TYPE achievement_condition_type_enum RENAME TO achievement_condition_type_enum_old;
    
    CREATE TYPE achievement_condition_type_enum AS ENUM ('score');
    
    ALTER TABLE achievements 
    ALTER COLUMN condition_type TYPE achievement_condition_type_enum 
    USING condition_type::text::achievement_condition_type_enum;
    
    DROP TYPE achievement_condition_type_enum_old;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw(`
    -- Restore the old enum with all values
    ALTER TYPE achievement_condition_type_enum RENAME TO achievement_condition_type_enum_new;
    
    CREATE TYPE achievement_condition_type_enum AS ENUM ('score', 'play_count', 'time', 'win_count');
    
    ALTER TABLE achievements 
    ALTER COLUMN condition_type TYPE achievement_condition_type_enum 
    USING condition_type::text::achievement_condition_type_enum;
    
    DROP TYPE achievement_condition_type_enum_new;
  `);
};
