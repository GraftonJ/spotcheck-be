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
*    200 { [
*           { locaId: YELP_LOCA_ID,
              rating: 4.3,
              checkIns: 16,
              comments: [ { user: { id: 3, fname: "Sue", lname: "Grant"},
                            comment: "this is a comment"}
                        ] },
            { ... }
         ] }
http GET localhost:3000/yelp
***************************************************** */
router.get('/', (req, res, next) => {
  console.log(`-- GET /yelp route`);
  res.status(200).json({ mykey: 15 });
  // knex("users")
  //   .then((aRecs) => {
  //     res.status(200).json({ users: aRecs });
  //   })
  //   .catch((error) => {
  //     next(routeCatch(`--- GET /users route`, error));
  //   });
});


module.exports = router;
