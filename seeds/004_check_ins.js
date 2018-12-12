
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('check_ins').del()
    .then(function () {
      // Inserts seed entries
      return knex('check_ins').insert([
        {id: 1, user_id: 1, loca_id: 'FJo2jznp56MU_IdDcX038A'},
        {id: 2, user_id: 2, loca_id: 'MCd01xGZtmfSsH_RUj4pAA'},
        {id: 3, user_id: 3, loca_id: '0A80IDh1Ag7jW4_D9sjQPQ'}
      ])
      .then(() => {
        return knex.raw(`SELECT setval('check_ins_id_seq', (SELECT MAX(id) FROM check_ins))`)
      })
    });
};
