const express = require('express')
const router = express.Router()
const knex = require('../knex')

const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const jwtSignAsync = promisify(jwt.sign);
const jwtVerifyAsync = promisify(jwt.verify);

require('dotenv').config();

/* **************************************
  POST check into a location
  @body user_id
  @body loca_id
  @return 200 { check_in: { id, user_id, loca_id, creatred_at } }
http POST localhost:3000/check_ins user_id=2 loca_id=YELP_CODE
*************************************** */
router.post('/', (req, res, next) => {

  knex('check_ins')
    .insert({
      "user_id": req.body.user_id,
      "loca_id": req.body.loca_id,
    })
    .returning(['id', 'user_id', 'loca_id', 'created_at'])
    .then((post) => {
      res.status(201).json({ check_in: post[0] })
    })
    .catch((error) => {
      console.log('ERROR', error)
      next(error)
    });
  return;
  //////////////////////////////////////////////////////
  // console.log('POST checkins route: ', req.body);
  //
  // // get the JWT token, not sure why it's added text and spc before it
  // const { auth } = req.headers;
  // console.log('------------------------------');
  // console.log('req: ', req);
  // console.log('------------------------------');
  // console.log('req.headers: ', req.headers);
  // console.log('------------------------------');
  //
  // // no auth header, so user isn't logged in
  // if (!auth) {
  //   console.log('no auth header');
  //   res.status(403).json( { error: "not logged in" } );
  //   return;
  // }
  // const token = auth.split(' ')[1];
  // console.log("------------------------------------------");
  // console.log("##### token: ", token);
  //
  // // verify token asynchronously
  // jwtVerifyAsync(token, process.env.JWT_KEY)
  //   .then((tokenPayload) => {
  //     console.log("##### payload: ", tokenPayload);
  //     if (!tokenPayload.loggedIn) {
  //       console.log("#---# not logged in");
  //       res.status(403).json( { error: "not logged in" } );
  //       return; // assuming there are no .next()s below or they would get control
  //     }
  //
  //     // SUCCESS, do the query
  //     knex('check_ins')
  //       .insert({
  //         "user_id": req.body.user_id,
  //         "loca_id": req.body.loca_id,
  //       })
  //       .returning(['id', 'user_id', 'loca_id', 'created_at'])
  //       .then((post) => {
  //         res.status(201).json({ check_in: post[0] })
  //       })
  //       .catch((error) => {
  //         console.log('ERROR', error)
  //         next(error)
  //       });
  //     return; // assuming there are no .next()s below or they would get control
  //   })
  //   // jwtVerifyAsync() throws is the token isn't valid
  //   .catch((err) => {
  //     console.log("*** payload: -- not a valid token");
  //     res.status(403).json({ error: "not a valid token" });
  //   })

})

module.exports = router;
