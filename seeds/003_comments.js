
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('comments').del()
    .then(function () {
      // Inserts seed entries
      return knex('comments').insert([
        {id: 1, loca_id: 'FJo2jznp56MU_IdDcX038A', user_id: 1, comment: "One of the best breweries near Boulder. I take my dog here and hang out on the patio. They have a nice fake grass area for him to lie down and there are usually several other dogs there too. They also have water bowls too!"},
        {id: 2, loca_id: 'MCd01xGZtmfSsH_RUj4pAA', user_id: 2, comment: "This is a great place to hang out on the patio and grab a quick lunch. They have water available if you need it for your dog"},
        {id: 3, loca_id: '0A80IDh1Ag7jW4_D9sjQPQ', user_id: 3, comment: "You can't bring your dog inside. But they have a nice patio area. The food is pretty good, too!"}
      ])
      .then(function() { return knex.raw("SELECT setval('comments_id_seq', (SELECT MAX(id) FROM comments))")
      })
    })
  }
