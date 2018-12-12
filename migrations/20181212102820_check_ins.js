exports.up = function(knex, Promise) {
	return knex.schema.createTable('check_ins', function(table) {
		// TABLE COLUMN DEFINITIONS HERE
		table.increments().notNullable().primary()
    table.integer('user_id').notNullable()
    table.foreign('user_id').references('users.id').onDelete('cascade')
    table.varchar('loca_id', 255).notNullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
	})
}
exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists('check_ins')
}
