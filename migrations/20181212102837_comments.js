
exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments', function(table) {
    //TABLE COLUMN DEFINITON
    table.increments().notNullable().primary()
    table.varChar('loca_id', 255).notNullable()
    table.text('comment').notNullable()
    table.integer('user_id').notNullable()
    table.foreign('user_id').references('users.id').onDelete('cascade')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('comments')
};
