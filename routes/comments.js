const express = require('express')
const router = express.Router()
const knex = require('../knex')

//Get all records from comments
//http http://localhost:3000/comments
router.get('/', (req, res, next) => {
  knex('comments')
    .then((rows) => {
      res.json(rows)
    })
    .catch((err) => {
      next(err)
    })
})

//Get one record from comments
//http http://localhost:3000/comments/1
router.get('/:id', (req, res, next) => {
  knex('comments')
    .where('id', req.params.id)
    .then((rows) => {
      res.json(rows)
    })
    .catch((err) => {
      next(err)
    })
})

//Post a comment
// http POST http://localhost:3000/comments loca_id="YELP_ID" user_id=3 rating=3 comment="This is a test post comment"
router.post('/', (req, res, next) => {
  knex('comments')
    .insert({
      "loca_id": req.body.loca_id,
      "user_id": req.body.user_id,
      "comment": req.body.comment,
      "rating": req.body.rating,
    })
    .returning('*')
    .then((data) => {
      res.json(data[0])
    })
    .catch((err) => {
      next(err)
    })
})

//Delete a comment
//http DELETE http://localhost:3000/comments/3
router.delete('/:id', (req, res, next) => {
  knex('comments')
  .where('id', req.params.id)
  .first()
  .then((row) => {
    if(!row) return next()
    knex('comments')
    .del()
    .where('id', req.params.id)
    .then(() => {
      res.send(`Comment Id ${req.params.id} deleted`)
    })
  })
  .catch((err) => {
    next(err)
  })
})

//Edit a comments
//http PATCH  http://localhost:3000/comments/3 comment="test comment666" rating=4 loca_id="YELP_ID" user_id=3
router.patch('/:id', (req, res, next) => {
    knex('comments')
    .where('id', req.params.id)
    .limit(1)
    .update({
      "loca_id": req.body.loca_id,
      "user_id": req.body.user_id,
      "comment": req.body.comment,
      "rating": req.body.rating,
    })
    .returning('*')
    .then((data) => {
      res.json(data[0])
    })
    .catch((err) => {
      next(err)
    })
})



module.exports = router
