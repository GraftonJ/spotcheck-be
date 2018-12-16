const express = require('express')
const router = express.Router()
const knex = require('../knex')

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
  })
})

module.exports = router;
