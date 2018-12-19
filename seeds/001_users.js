exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, name: 'Cassi Bailey', email: 'Cbaily@gmail.com', pswd_hash: '$2a$04$4ftzK1OP8JH5CqVsp3Vf..Nrhgj3QP6PN2bHEPO1tRF1LmHuICdNW', dog_names: 'Spot the Dog'},
        {id: 2, name: 'Steve Wilson', email: 'Swilson@gmail.com', pswd_hash: '$2a$04$4ftzK1OP8JH5CqVsp3Vf..Nrhgj3QP6PN2bHEPO1tRF1LmHuICdNW', dog_names: 'Bender and Scooter'},
        {id: 3, name: 'Isabel Sampson', email: 'Isampson@gmail.com', pswd_hash: '$2a$04$4ftzK1OP8JH5CqVsp3Vf..Nrhgj3QP6PN2bHEPO1tRF1LmHuICdNW', dog_names: 'Luna'},
        {id: 4, name: 'Nate User', email: 'Nuser@gmail.com', pswd_hash: '$2a$04$4ftzK1OP8JH5CqVsp3Vf..Nrhgj3QP6PN2bHEPO1tRF1LmHuICdNW', dog_names: 'Luna'},
        {id: 5, name: 'Elizabeth Silver', email: 'Elizabeth@gmail.com', pswd_hash: '$2a$04$4ftzK1OP8JH5CqVsp3Vf..Nrhgj3QP6PN2bHEPO1tRF1LmHuICdNW', dog_names: 'Luna'},
      ])
      .then(() => {
				 // Moves id column (PK) auto-incremented to correct value after inserts
				return knex.raw(`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))`)
			})
    })
}
