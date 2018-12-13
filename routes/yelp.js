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
*           { locaId: YELP_LOCA_ID,
              cntCheckIns: 16,
              comments: [ { user: { id: 3, fname: "Sue", lname: "Grant"},
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
  try {
    const aLocaIds = req.body.locaIds;
    // console.log('--- locaIds: ', aLocaIds);
    // const sLocaIds = aLocaIds.reduce((str, locaId) => `${locaId} ${str}`, '');
    // console.log('--- sLocaIds: ', sLocaIds);
    let aComments = [];
    let aCheckIns = [];
    // TODO: flatten and speed this up by doing Promise.all() for two queries
    // TODO: make the query on check_ins table a SUM

    // get comments for list of Yelp locaIds
    console.log('1 ====== aLocaIds: ', aLocaIds);
    knex('comments')
      .whereIn('loca_id', aLocaIds)
      .join('users', 'users.id', 'user_id')
      .select('comments.*', 'users.fname', 'users.lname', 'users.dog_names')
      .then((aRecs) => {
        console.log("2 --> comments returning: ", aRecs);
        aComments = aRecs;
      })

      // get check_ins for list of Yelp locaIds
      .then(() => {
        console.log('2.5 then()');
        knex('check_ins')
          .whereIn('loca_id', aLocaIds)
          .join('users', 'users.id', 'user_id')
          .select('check_ins.*', 'users.fname', 'users.lname', 'users.dog_names')
          .then((aRecs) => {
            console.log("3 --> check_ins returning: ", aRecs);
            aCheckIns = aRecs;
          })
          // catch errors from this level of then()s
          .catch((error) => {
            next(routeCatch(`--- INNER CATCH -- GET /yelp route`, error));
          });
      })

      // build and return data structure: array of Yelp loca_ids with summary
      //   infromation on the comments and checkins for each location
      .then(() => {
        const aLocaInfo = [];
        for (const locaId of aLocaIds) {
          console.log('4 -----');
          console.log("5 %% locaId, aCheckins", locaId, aLocaIds);
          const objLocaInfo = {
            locaId,
            numCheckIns: aCheckIns.reduce((cnt, checkIn) => {
              return cnt + ((checkIn.loca_id === locaId) ? 1 : 0);
            }, 0),
            comments: aComments.filter(comment => comment.loca_id === locaId),
          };

          aLocaInfo.push(objLocaInfo);
        }


        res.status(200).json(aLocaInfo);
      })

      // catch errors
      .catch((error) => {
        next(routeCatch(`--- GET /yelp route`, error));
      });
  } catch (err) {
    console.log("--- try/catch ERROR: ", err);
    res.status(500).json(err);
  }
  // res.status(200).json({ mykey: 15 });
  // knex("users")
  //   .then((aRecs) => {
  //     res.status(200).json({ users: aRecs });
  //   })
  //   .catch((error) => {
  //     next(routeCatch(`--- GET /users route`, error));
  //   });
});


module.exports = router;
