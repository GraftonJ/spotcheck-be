/*
  The standard route catch handler for all route .catch sections.

  To use it from in a .then():
    -- setup an Error object
    -- set error.status
    -- throw the new error
    -- add next("the route's name", error_caught)

  Example code:
  knex("my-table")
  .then((aRecs) => {
    if (aRecs[0].end_time) {
      console.log("-- PATCH route throw error, shift already clocked out");
      const error = new Error(`unable to clock-out, shift already clocked out for id: req.params.id`);
      error.status = 401;
      throw error; // send to .catch() below.
                   // MUST throw to prevent following .then()'s from executing
    }
    })
  .catch((error) => {
    next(routeCatch("-- PATCH route catch error: ", error));
*/

function routeCatch(sRouteName, _error) {
  console.log(sRouteName, _error);
  let error = _error;

  // if error is from knex or the js engine
  if (!error.status) {
    console.log("-- regenerating the call stack for a knex error");
    const newError = new Error(error.message);
    error = newError;
  }
  error.status = error.status || 500;
  return error;
}

module.exports = routeCatch;
