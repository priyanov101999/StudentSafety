/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("report", function (table) {
    table.uuid("id", 36).primary().notNullable();
    table.string("currentLatitude").notNullable();
    table.string("currentLongitude").notNullable();
    table
      .uuid("policeStationId")
      .references("id")
      .inTable("police_station")
      .onDelete("CASCADE")
      .notNullable();
    table
      .uuid("reportTypeId")
      .references("id")
      .inTable("report_type")
      .onDelete("CASCADE")
      .notNullable();
    table.string("reportDate").notNullable();
    table.boolean("isResolved").defaultTo(0).notNullable();
    table
      .uuid("policemanId")
      .references("id")
      .inTable("policeman")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("report");
};
