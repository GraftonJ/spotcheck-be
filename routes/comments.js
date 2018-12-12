const express = require('express')
const router = express.Router()
const knex = require('../knex')

//Get all records from comments
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
router.post('/', (req, res, next) => {
  knex('comments')
    .insert({
      "loca_id": req.body.loca_id,
      "user_id": req.body.user_id,
      "comment": req.body.comment
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
