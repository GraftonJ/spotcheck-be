
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const jwtSignAsync = promisify(jwt.sign);
const jwtVerifyAsync = promisify(jwt.verify);

/*
   Authorization middleware:

   1. Looks for JWT in header:  "Auth", "Bearer: DFRGHTFDGFD45FGDFDGFD..."
   2. Looks for { UserId: 123, isLoggedIn: true } in JWT tokenPayload
   3. Ensures JWT UserId === req.body.user_id

   If all is good calls next().

   CHANGED THIS: If a problem it will do a 403 return with { error: "not logged in" } or
    another message.  Note:  Other examples call next(err) when there's
    a problem which is better as the final error handler may do other
    things like logging the error.

   NOW: If a problem call next(errorMsg).  Problem is that 500 doesn't put
          the message in the response back to app.  Would need to dig deeper
          into the error handling to get the server message to display in the
          app.
*/

module.exports = async (req, res, next) => {
  console.log("auth2()");

  // get the JWT token
  let { auth } = req.headers;

  // no auth header, so user isn't logged in
  if (!auth) {
    console.log('no auth header');
    // res.status(403).json( { error: "not logged in" } );
    next({ error: "not logged in" });
    return;
  }

  const token = auth.split(' ')[1]; // "Bearer: ASFERREGER456RGREGR...""

  // verify token asynchronously
  jwtVerifyAsync(token, process.env.JWT_KEY)
    .then((tokenPayload) => {
      console.log("##### payload: ", tokenPayload);

      // check that user is logged in
      if (!tokenPayload.loggedIn) {
        console.log("#---# not logged in");
        // res.status(403).json( { error: "not logged in" } );
        next({ error: "not logged in" });
        return; // assuming there are no .next()s below or they would get control
      }

      // check that req.body.user_id matches userId in the JWT
      if (tokenPayload.userId !== req.body.user_id) {
        console.log("#---# user mismatch, we're being hacked!");
        console.log('tokenPayload.userId: ', tokenPayload.userId);
        console.log('eq.body.user_id: ', req.body.user_id);
        // res.status(403).json( { error: "userId of JWT !== req.body.user_id" } );
        next({ error: "userId of JWT !== req.body.user_id" });
        return; // assuming there are no .next()s below or they would get control
      }
    })
  console.log("auth() is authorized");
  next();
}
