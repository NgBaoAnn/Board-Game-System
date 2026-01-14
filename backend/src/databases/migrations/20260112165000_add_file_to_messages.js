/**
 * Add file attachment columns to messages table
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("messages", (table) => {
    // File attachment fields
    table.string("file_url", 500).nullable();  // URL to the uploaded file
    table.string("file_name", 255).nullable(); // Original file name
    table.string("file_type", 50).nullable();  // MIME type (e.g., image/png, application/pdf)
    table.integer("file_size").nullable();     // File size in bytes
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("messages", (table) => {
    table.dropColumn("file_url");
    table.dropColumn("file_name");
    table.dropColumn("file_type");
    table.dropColumn("file_size");
  });
};
