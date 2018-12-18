const express = require('express')
const router = express.Router()
const knex = require('../knex')

// const { promisify } = require('util');
// const jwt = require('jsonwebtoken');
//
// const jwtSignAsync = promisify(jwt.sign);
// const jwtVerifyAsync = promisify(jwt.verify);

const authMW  = require('./authMiddleware')

require('dotenv').config();

/* *********************************************** */
// const authMW = async (req, res, next) => {
//   console.log("auth()");
//
//   // get the JWT token
//   const { auth } = req.headers;
//
//   // no auth header, so user isn't logged in
//   if (!auth) {
//     console.log('no auth header');
//     res.status(403).json( { error: "not logged in" } );
//     return;
//   }
//
//   const token = auth.split(' ')[1]; // "Bearer: ASFERREGER456RGREGR...""
//
//   // verify token asynchronously
//   jwtVerifyAsync(token, process.env.JWT_KEY)
//     .then((tokenPayload) => {
//       console.log("##### payload: ", tokenPayload);
//
//       // check that user is logged in
//       if (!tokenPayload.loggedIn) {
//         console.log("#---# not logged in");
//         res.status(403).json( { error: "not logged in" } );
//         return; // assuming there are no .next()s below or they would get control
//       }
//
//       // check that user checking-in matches userId in the JWT
//       if (tokenPayload.userId !== req.body.user_id) {
//         console.log("#---# user mismatch, we're being hacked!");
//         console.log('tokenPayload.userId: ', tokenPayload.userId);
//         console.log('eq.body.user_id: ', req.body.user_id);
//         res.status(403).json( { error: "userId of JWT !== req.body.user_id" } );
//         return; // assuming there are no .next()s below or they would get control
//       }
//     })
//   console.log("auth() is authorized");
//   next();
// }

// console.log("authMW ", authMW);
/* **************************************
  POST check into a location
  @body user_id
  @body loca_id
  @return
      200 { check_in: { id, user_id, loca_id, creatred_at } }
      403 { error: 'not logged in' } // or another message
http POST localhost:3000/check_ins user_id=2 loca_id=YELP_CODE
*************************************** */
router.post('/', authMW, (req, res, next) => {

  //////////////////////////////////////////////////////
  // working code of unprotected route
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
  // const authorized = auth(req, res, next);
  // if (!authorized) return;

  // // get the JWT token
  // const { auth } = req.headers;
  //
  // // no auth header, so user isn't logged in
  // if (!auth) {
  //   console.log('no auth header');
  //   res.status(403).json( { error: "not logged in" } );
  //   return;
  // }
  //
  // const token = auth.split(' ')[1]; // "Bearer: ASFERREGER456RGREGR...""

  // verify token asynchronously

  // jwtVerifyAsync(token, process.env.JWT_KEY)
  //   .then((tokenPayload) => {
  //     console.log("##### payload: ", tokenPayload);
  //
  //     // check that user is logged in
  //     if (!tokenPayload.loggedIn) {
  //       console.log("#---# not logged in");
  //       res.status(403).json( { error: "not logged in" } );
  //       return; // assuming there are no .next()s below or they would get control
  //     }
  //
  //     // check that user checking-in matches userId in the JWT
  //     if (tokenPayload.userId !== req.body.user_id) {
  //       console.log("#---# user mismatch, we're being hacked!");
  //       console.log('tokenPayload.userId: ', tokenPayload.userId);
  //       console.log('eq.body.user_id: ', req.body.user_id);
  //       res.status(403).json( { error: "userId of JWT !== req.body.user_id" } );
  //       return; // assuming there are no .next()s below or they would get control
  //     }
      //
      // // SUCCESS, do the query to add the checkin
      // knex('check_ins')
      //   .insert({
      //     "user_id": req.body.user_id,
      //     "loca_id": req.body.loca_id,
      //   })
      //   .returning(['id', 'user_id', 'loca_id', 'created_at'])
      //   .then((post) => {
      //     res.status(201).json({ check_in: post[0] })
      //   })
      //   .catch((error) => {
      //     console.log('ERROR', error)
      //     next(error)
      //   });
      // return; // assuming there are no .next()s below or they would get control
    // })
    // jwtVerifyAsync() throws is the token isn't valid
    // .catch((err) => {
    //   console.log("*** payload: -- not a valid token");
    //   res.status(403).json({ error: "not a valid token" });
    // })

})

module.exports = router;
