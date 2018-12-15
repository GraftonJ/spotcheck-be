exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, name: 'Cassi Bailey', email: 'cbaily@gmail.com', pswd_hash: '1234', dog_names: 'Spot the Dog'},
        {id: 2, name: 'Steve Wilson', email: 'swilson@gmail.com', pswd_hash: '1234', dog_names: 'Bender and Scooter'},
        {id: 3, name: 'Isabel Sampson', email: 'isampson@gmail.com', pswd_hash: '1234', dog_names: 'Luna'},
        {id: 4, name: 'New User', email: 'nuser@gmail.com', pswd_hash: 'secret', dog_names: 'Luna'},
      ])
      .then(() => {
				 // Moves id column (PK) auto-incremented to correct value after inserts
				return knex.raw(`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))`)
			})
    })
}
