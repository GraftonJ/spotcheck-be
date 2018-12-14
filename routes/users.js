const express = require('express')
const router = express.Router()
const knex = require('../knex')
const bcrypt = require('bcrypt')

const routeCatch = require('./routeCatch');
const { chkBodyParams } = require('./params'); // destructure the chkBodyParams out of require('./params') returned object

const SALT_ROUNDS = 2;

/* **************************************************
*  hashAsync()
*  Returns Promise for pswd_hash
***************************************************** */
function hashAsync(password) {
  // let sHash = "";
  return bcrypt.hash(password, SALT_ROUNDS)
    .then((hashValue) => {
      // sHash = hashValue;
      // console.log("hash: ", hashValue);
      return hashValue;
    });
}

/* **************************************************
*  hashCompareAsync()
*  Returns Promise for t/f if pswd matches hash
***************************************************** */
function hashCompareAsync(password, pswd_hash) {
  return bcrypt.compare(password, pswd_hash);
}

/* **************************************************
*  POST
*  Add a new user
*    Their email address must be unique
*  @body name (string)
*  @body email (string)
*  @body dog_names (string)
*  Return
*    200 { user: { id, name, ... } }
*    409 { error": "email already exists" }
*
http POST localhost:3000/users/ name="New User" email=nuser@gmail.com dog_names=Rex password=secret
***************************************************** */
router.post('/', (req, res, next) => {
  console.log("-- POST /users route: ", req.params.user_id);
  const oParams = {
    name: 'string',
    email: 'string',
    dog_names: 'string',
    password: 'string',
  };
  if (!chkBodyParams(oParams, req, res, next)) {
    return;
  }
  const { name, email, dog_names, password } = req.body;
  const oNewUser = {
    name,
    email,
    dog_names,
    pswd_hash: password,
  }
  console.log('oNewUser: ', oNewUser);

  // check that the email address no already in use
  knex('users')
    .where('email', email)
    .then((aRecsMatchingEmail) => {
      if (aRecsMatchingEmail.length) {
        console.log("fail: email address already exists");
        res.status(409).json({ error: 'email already exists' });
        return;
      }
      // add the new user
      console.log("continue: email is unique");

      // get the password hash
      let pswd_hash = '';
      hashAsync(password)
        .then((pswd_hash) => {
          console.log("pswd_hash ", pswd_hash);
          oNewUser.pswd_hash = pswd_hash;
          knex('users')
            .insert([oNewUser]) // param is in the format of the fields so use destructuring
            .returning('*') // gets array of the inserted records
            .then((aRecs) => {
              console.log("--> insert returning: ", aRecs);
              res.status(201).json({ user: aRecs[0] });
              return;
            })
            .catch((error) => {
              next(routeCatch(`--- (3) POST /users route, error: `, error));
            });
        })
        .catch((error) => {
          next(routeCatch(`--- (2) POST /users route, error: `, error));
        });
    })
    .catch((error) => {
      next(routeCatch(`--- POST /users route, error: `, error));
    });
});

/* **************************************************
*  PATCH /:id
*  Update a user's info
*  @body name (string)
*  @body email (string)
*  @body dog_names (string)
*  Return
*    200 { user: { id, name, ... } }
*  TODO: guard that user can only update their own info
http PATCH localhost:3000/users/1 name="John Doe" email=jdoe@gmail.com dog_names=Sparky
***************************************************** */
router.patch('/:id', (req, res, next) => {
  console.log("-- PATCH /users route: ", req.params.user_id);
  const oParams = {
    name: 'string',
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
      name: req.body.name,
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
*    200 { ratings: [ { id, name, ... }, { ... } ]
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
