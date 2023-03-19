/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("report_type", function (table) {
    table.uuid("id", 36).primary().notNullable();
    table.string("name", 255).notNullable();
    table.text("imageUrl", 255).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("report_type");
};
