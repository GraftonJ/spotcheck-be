const express = require('express')
const router = express.Router()
const knex = require('../knex')

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
