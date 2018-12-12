const express = require('express')
const router = express.Router()
const knex = require('../knex')

const routeCatch = require('./routeCatch');
const { chkBodyParams } = require('./params'); // destructure the chkBodyParams out of require('./params') returned object

/* **************************************************
*  GET /
*  Get the comments, ratings, and checkins for array of restaurants
*  @body loca_ids (array of YELP_LOCA_ID strings) [ 'DFWFRGEFD', 'FGRE65FG']
*  Return
*    200  {
           [
*           { locaId: YELP_LOCA_ID,
              checkIns: 16,
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
    // console.log("--- req: ", req);
    const aLocaIds = req.body.locaIds;
    // console.log('--- locaIds: ', aLocaIds);
    // const sLocaIds = aLocaIds.reduce((str, locaId) => `${locaId} ${str}`, '');
    // console.log('--- sLocaIds: ', sLocaIds);
    let retVal = '';
    knex('comments')
      .whereIn('loca_id', aLocaIds)
      .join('users', 'users.id', 'user_id')
      .select('comments.*', 'users.fname', 'users.lname', 'users.dog_names')
      .then((aRecs) => {
        console.log("--> qry returning: ", aRecs);
        retVal = aRecs;
      })
      .then(() => {
        // console.log(">>> retVal: ", retVal);
        res.status(200).json(retVal);
      })
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
