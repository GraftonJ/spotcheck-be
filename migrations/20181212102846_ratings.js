exports.up = function(knex, Promise) {
	return knex.schema.createTable(`ratings`, function(table) {
		// TABLE COLUMN DEFINITIONS HERE
		table.increments().notNullable().primary()
		table.varchar('loca_id', 255).notNullable()
		table.integer('user_id').notNullable()
    table.foreign('user_id').references('users.id').onDelete('CASCADE')
		table.integer('rating').notNullable()
		table.unique(['loca_id', 'user_id' ])
	})
}
exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists(`ratings`)
}
