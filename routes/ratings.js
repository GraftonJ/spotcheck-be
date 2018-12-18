const express = require('express')
const router = express.Router()
const knex = require('../knex')

const authMW  = require('./authMiddleware')

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
*    403 { error: 'not logged in' } // or another message
http POST localhost:3000/ratings user_id=1 loca_id=YELP_LOCA_ID_HERE rating=3
***************************************************** */
router.post('', authMW, (req, res, next) => {
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

/* **************************************************
*  PATCH /:id
*  Update a user's rating of a location
*  @param id (integer)
*  @body user_id (integer)
*  @body loca_id (string, the Yelp loca id)
*  @body rating (integer 1 to 5)
*  Return
*    200 { rating: { id, loca_id, user_id, rating } }
http PATCH localhost:3000/ratings/2 rating=3
***************************************************** */
router.patch('/:id', (req, res, next) => {
  console.log("-- PATCH /ratings route: ", req.params.user_id);
  const oParams = {
    rating: 'int',
  };
  if (!chkBodyParams(oParams, req, res, next)) {
    return;
  }
  // TODO:  Add guard that only user can change their own rating

  knex('ratings')
    .where('id', req.params.id)
    .update({
      rating: req.body.rating,
    })
    .returning('*')
    .then((aRecs) => {
      console.log("--> patch returning: ", aRecs);
      res.status(201).json({ rating: aRecs[0] });
      // return;
    })
    .catch((error) => {
      next(routeCatch(`--- PATCH /ratings route, error: `, error));
    });
});

/* **************************************************
*  GET /
*  Get all ratings
*  Return
*    200 { ratings: [ { id, loca_id, user_id, rating }, { ... } ]
http GET localhost:3000/ratings
***************************************************** */
router.get('/', (req, res, next) => {
  console.log(`-- GET /ratings route`);
  knex("ratings")
    .then((aRecs) => {
      res.status(200).json({ ratings: aRecs });
    })
    .catch((error) => {
      next(routeCatch(`--- GET /ratings route`, error));
    });
});

module.exports = router
