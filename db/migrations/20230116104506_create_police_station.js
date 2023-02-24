/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("police_station", function (table) {
    table.uuid("id", 36).primary().notNullable();
    table.string("latitude").notNullable();
    table.string("longitude").notNullable();
    table.string("name").notNullable();
    table.string("password").notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("police_station");
};
