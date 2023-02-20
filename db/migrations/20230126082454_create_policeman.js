/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("policeman", function (table) {
    table.uuid("id", 36).primary().notNullable();
    table.string("name", 255).notNullable();
    table.string("mobileNo").notNullable();
    table.string("emailId").notNullable();
    table
      .uuid("policeStationId")
      .references("id")
      .inTable("police_station")
      .onDelete("CASCADE")
      .notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("policeman");
};
