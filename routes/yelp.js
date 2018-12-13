const express = require('express')
const router = express.Router()
const knex = require('../knex')

const routeCatch = require('./routeCatch');
const { chkBodyParams } = require('./params'); // destructure the chkBodyParams out of require('./params') returned object

/* **************************************************
*  GET /
*  Get the comments, ratings, and checkins for array of restaurants
*  @body loca_ids (array of YELP_LOCA_ID strings)
*                   [ 'MCd01xGZtmfSsH_RUj4pAA', '0A80IDh1Ag7jW4_D9sjQPQ']
*  Return
*    200  {
           [
            { locaId: 3232fT5656,
              numCheckIns: 16,
              comments: [ { locaId: 3232fT5656,
                            user: { id: 3, fname: "Sue", lname: "Grant", dogName: "Sparky"},
                            rating: 4,
                            comment: "this is a comment"}
                        ] },
            { ... }
           ]
          }
http GET localhost:3000/yelp
***************************************************** */
// router.get('/', (req, res, next) => {
router.post('/', (req, res, next) => {
  console.log(`-- POST /yelp route`);

  const aLocaIds = req.body.locaIds;

  let aComments = [];
  let aCheckIns = [];

  // TODO: flatten and speed this up by doing Promise.all() for two queries
  // TODO: make the query on check_ins table a SUM

  // get comments for list of Yelp locaIds
  knex('comments')
    .whereIn('loca_id', aLocaIds)
    .join('users', 'users.id', 'user_id')
    .select('comments.*', 'users.fname', 'users.lname', 'users.dog_names')
    .then((aRecs) => {
      // aComments = aRecs;
      aComments = aRecs.map((rec) => {
        return {
          locaId: rec.loca_id,
          user: {
            id: rec.user_id,
            fname: rec.fname,
            lname: rec.lname,
            dogNames: rec.dog_names,
          },
          rating: rec.rating,
          comment: rec.comment,
        };
      })
    })

    // get check_ins for list of Yelp locaIds
    .then(() => {
      knex('check_ins')
        .whereIn('loca_id', aLocaIds)
        .join('users', 'users.id', 'user_id')
        .select('check_ins.*', 'users.fname', 'users.lname', 'users.dog_names')
        .then((aRecs) => {
          aCheckIns = aRecs;
        })

        // build and return data structure: array of Yelp loca_ids with summary
        //   infromation on the comments and checkins for each location
        .then(() => {
          const aLocaInfo = [];
          for (const locaId of aLocaIds) {

            const objLocaInfo = {
              locaId,
              numCheckIns: aCheckIns.reduce((cnt, checkIn) => {
                return cnt + ((checkIn.loca_id === locaId) ? 1 : 0);
              }, 0),
              comments: aComments.filter(comment => comment.locaId === locaId),
            };

            aLocaInfo.push(objLocaInfo);
          }
          res.status(200).json(aLocaInfo);
        })
        // catch errors
        .catch((error) => {
          next(routeCatch(`--- GET /yelp route`, error));
        });
    })
    .catch((err) => {
      console.log("--- try/catch ERROR: ", err);
      res.status(500).json(err);
    });
});


module.exports = router;
