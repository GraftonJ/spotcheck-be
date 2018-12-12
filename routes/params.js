
/* **************************************************
*  chkBodyParam()
*  Verify req.body has the required param of specified type or do a next(error)
*  @param bodyParam, the parameter to look for in the body
*  @param type, required type: bool, int, or string
*  @param req, res, next
*  @return t/f if validation succeeded.  If false caller must return as
*          an error response has already been setup in call to next(Error)
*  ************************************************* */
function chkBodyParam(bodyParam, type, req, res, next) {
  console.log("chkBodyParam for: ", bodyParam);
  let testValue = String(req.body[bodyParam]);

  // had to change next line to handle params that were actually Numbers since
  // AXIOS can pass a number as string OR as a Number
  // if (!req.body[bodyParam] || !req.body[bodyParam].trim().length) {

  if (!req.body[bodyParam] || !testValue.trim().length) {
    const error = new Error(`missing body param: '${bodyParam}'`);
    error.status = 400;
    next(error);
    return false;
  }

  // const testValue = req.body[bodyParam];
  let typeCheckFailed = false;

  switch (type) {

    case 'bool':
      if (testValue.toLowerCase() !== 'true' && testValue.toLowerCase() !== 'false')
        typeCheckFailed = true;
      break;

    case 'int':
      typeCheckFailed = (String(parseInt(testValue, 10)) !== testValue);
      break;

    case 'string': // all body params are a string!
      // console.log("**** testValue instanceof String: ", testValue instanceof String);
      // console.log("**** typeof testValue: ", typeof testValue);
      // console.log("**** testValue: ", testValue);
      typeCheckFailed = typeof testValue !== 'string';
      break;

    default: {
      throw new Error(`Developer error, bad type param to testBodyParam(): ${type}`);
    }
  }

  if (typeCheckFailed) {
    const error = new Error(`body param '${bodyParam}' must be of type '${type}'`);
    error.status = 400;
    next(error);
    return false;
  }
  return true;
}

/* **************************************************
*  chkBodyParams()
*  Verify req.body has the required params of specified types or do a next(error)
*  @param bodyParams, object with name/value pairs of field names / types req'd in body
*       { field1: 'int', field2: 'bool', field3: 'string'}
*  @param req, res, next
*  @return t/f if validation succeeded.  If false caller must return as
*          an error response has already been setup in call to next(Error)
*  ************************************************* */
function chkBodyParams(oBodyParams, req, res, next) {
  const aBodyParams = Object.entries(oBodyParams);
  for (const param of aBodyParams) {
    if (!chkBodyParam(param[0], param[1], req, res, next)) {
      console.log("chkBodyParams returning false");
      return false;
    }
  }
  return true;
}

module.exports = {
  chkBodyParams,
};
