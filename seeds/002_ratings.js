
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('ratings').del()
    .then(() => {
      // Inserts seed entries
      return knex('ratings').insert([
        {id: 1, loca_id: '0A80IDh1Ag7jW4_D9sjQPQ', user_id: '1', rating: 4},
        {id: 2, loca_id: '0A80IDh1Ag7jW4_D9sjQPQ', user_id: '3', rating: 3},
        {id: 3, loca_id: 'MCd01xGZtmfSsH_RUj4pAA', user_id: '1', rating: 5},
        {id: 4, loca_id: 'MCd01xGZtmfSsH_RUj4pAA', user_id: '2', rating: 1},
        {id: 5, loca_id: 'MCd01xGZtmfSsH_RUj4pAA', user_id: '3', rating: 2},
      ])
      .then(() => {
				 // Moves id column (PK) auto-incremented to correct value after inserts
				return knex.raw(`SELECT setval('ratings_id_seq', (SELECT MAX(id) FROM ratings))`)
			})
    })
}
