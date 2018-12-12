const express = require('express')
const router = express.Router()
const knex = require('../knex')

const routeCatch = require('./routeCatch');
const { chkBodyParams } = require('./params'); // destructure the chkBodyParams out of require('./params') returned object

/* **************************************************
*  PATCH /:id
*  Update a user's info
*  @body fname (string)
*  @body lname (string)
*  @body email (string)
*  @body dog_names (string)
*  Return
*    200 { user: { id, fname, lname, ... } }
*  TODO: guard that user can only update their own info
http PATCH localhost:3000/users/1 fname=John lname=Doe email=jdoe@gmail.com dog_names=Sparky
***************************************************** */
router.patch('/:id', (req, res, next) => {
  console.log("-- PATCH /users route: ", req.params.user_id);
  const oParams = {
    fname: 'string',
    lname: 'string',
    email: 'string',
    dog_names: 'string',
  };
  if (!chkBodyParams(oParams, req, res, next)) {
    return;
  }
  // TODO:  Add guard that only user can change their own rating

  knex('users')
    .where('id', req.params.id)
    .update({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      dog_names: req.body.dog_names,
    })
    .returning('*')
    .then((aRecs) => {
      console.log("--> patch returning: ", aRecs);
      res.status(201).json({ rating: aRecs[0] });
      // return;
    })
    .catch((error) => {
      next(routeCatch(`--- PATCH /users route, error: `, error));
    });
});

/* **************************************************
*  GET /
*  Get all users
*  Return
*    200 { ratings: [ { id, fname, lname, ... }, { ... } ]
http GET localhost:3000/users
***************************************************** */
router.get('/', (req, res, next) => {
  console.log(`-- GET /users route`);
  knex("users")
    .then((aRecs) => {
      res.status(200).json({ users: aRecs });
    })
    .catch((error) => {
      next(routeCatch(`--- GET /users route`, error));
    });
});

module.exports = router;
