require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
  silent: true,
});
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = supabase;
