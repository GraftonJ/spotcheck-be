const express = require('express')
const router = express.Router()
const knex = require('../knex')

const routeCatch = require('./routeCatch');
const { chkBodyParams } = require('./params'); // destructure the chkBodyParams out of require('./params') returned object

/* **************************************************
*  POST /
*  Add a new rating for a restaurant
*  @body user_id (integer)
*  @body loca_id (string, the Yelp loca id)
*  @body rating (integer 1 to 5)
*  Return
*    200 { rating: { id, loca_id, user_id, rating } }
http POST localhost:3000/ratings user_id=1 loca_id=YELP_LOCA_ID_HERE rating=3
***************************************************** */
router.post('', (req, res, next) => {
  console.log("-- POST route ratings/: ", req.params.user_id);
  const oParams = {
    user_id: 'int',
    loca_id: 'string',
    rating: 'int',
  };
  if (!chkBodyParams(oParams, req, res, next)) {
    return;
  }
  const oRating = {
    // id: not-passed-to-create-new-record
    user_id: req.body.user_id,
    loca_id: req.body.loca_id,
    rating: req.body.rating,
  };

  // TODO: check that there isn't already a rating for this loca by this person
  //       BETTER:  get that into the table definition file

  knex('ratings')
    .insert([oRating]) // param is in the format of the fields so use destructuring
    .returning('*') // gets array of the inserted records
    .then((aRecs) => {
      console.log("--> create returning: ", aRecs);
      res.status(201).json({ rating: aRecs[0] });
      // return;
    })
    .catch((error) => {
      next(routeCatch(`--- POST route ratings, error: `, error));
    });
});

module.exports = router
