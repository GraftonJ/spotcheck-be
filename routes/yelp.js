const express = require('express')
const router = express.Router()
const knex = require('../knex')

const routeCatch = require('./routeCatch');
const { chkBodyParams } = require('./params'); // destructure the chkBodyParams out of require('./params') returned object

/* **************************************************
*  POST /
*  Get the comments, ratings, and checkins for array of restaurants
*  @body locaIds (array of YELP_LOCA_ID strings)
*                   ['MCd01xGZtmfSsH_RUj4pAA', '0A80IDh1Ag7jW4_D9sjQPQ']
*  Return an array with ALL of the yelp ids (fills in 0 and [] if there
*               weren't any checkins or comments for the location)
*    200  {
           [
            { id: 3232fT5656,
              numCheckIns: 16,
              comments: [ { locaId: 3232fT5656,
                            user: { id: 3, name: "Sue Grant", dogName: "Sparky"},
                            rating: 4,
                            comment: "this is a comment"}
                        ] },
            { ... }
           ]
          }
HTTP tested with /public/test.html which uses /public/test-yelp.js
***************************************************** */
// router.get('/', (req, res, next) => {
router.post('/', (req, res, next) => {
  console.log(`-- POST /yelp route`);

  const aLocaIds = req.body.locaIds;
  console.log('aLocaIds = ', aLocaIds);

  let aComments = [];
  let aCheckIns = [];

  // TODO: flatten and speed this up by doing Promise.all() for two queries
  // TODO: make the query on check_ins table a SUM

  // get comments for list of Yelp locaIds
  const promise1 = knex('comments')
    .whereIn('loca_id', aLocaIds)
    .join('users', 'users.id', 'user_id')
    .select('comments.*', 'users.name', 'users.dog_names')
    .then((aRecs) => {
      // aComments = aRecs;
      aComments = aRecs.map((rec) => {
        return {
          locaId: rec.loca_id,
          user: {
            id: rec.user_id,
            name: rec.name,
            dogNames: rec.dog_names,
          },
          rating: rec.rating,
          comment: rec.comment,
        };
      });
    });

  // get check_ins for list of Yelp locaIds
  const promise2 = knex('check_ins')
    .whereIn('loca_id', aLocaIds)
    .join('users', 'users.id', 'user_id')
    .select('check_ins.*', 'users.name', 'users.dog_names')
    .then((aRecs) => {
      aCheckIns = aRecs;
    });

  Promise.all([promise1, promise2])
    // build and return data structure: array of Yelp loca_ids with summary
    //   infromation on the comments and checkins for EACH location.
    //   Will fill in 0 and [] for location without checkins or comments.
    .then(() => {
      const aLocaInfo = [];
      for (const locaId of aLocaIds) {

        const objLocaInfo = {
          id: locaId,
          numCheckIns: aCheckIns.reduce((cnt, checkIn) => {
            return cnt + ((checkIn.loca_id === locaId) ? 1 : 0);
          }, 0),
          comments: aComments.filter(comment => comment.locaId === locaId).reverse(),
        };

        aLocaInfo.push(objLocaInfo);
      }
      res.status(200).json(aLocaInfo);
    })
    // catch errors
    .catch((error) => {
      next(routeCatch(`--- GET /yelp route`, error));
    });
});

module.exports = router;
