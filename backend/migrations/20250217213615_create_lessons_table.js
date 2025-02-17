/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('lessons', (table) => {
    table.increments('id');
    table.string('lesson_number');
    table.string('lesson_name');
    table.string('category');
    table.text('summary');
    table.string('url');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('lessons');
};
