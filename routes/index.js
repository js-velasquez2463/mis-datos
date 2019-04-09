'use strict'
const express = require('express')
const router = express.Router()
const passport = require('../configuration/passport')
const errorHandler = require('../middleware/errorHandler')

const users = require('../controllers/users')
const transactions = require('../controllers/transactions')

router.get('/api', (req, res) => res.status(200).send({
  message: 'Welcome to Mis datos API!'
}))
router.post('/api/authenticate', users.authenticate)

router.use(passport.authenticate('jwt', { session: false }))

// user routes
router.post('/api/users/register', users.create)

// Transactions routes
router.post('/api/transactions', transactions.create)
router.get('/api/users/:userId/transactions', transactions.getTransactions)
router.put('/api/transactions/:transactionId/inactivate', transactions.inactivateTransaction)
router.get('/api/users/:userId/points', transactions.getUserPoints)
router.get('/api/users/:userId/exportExcel', transactions.getUserReport)

// handle http errors
router.use(errorHandler)

module.exports = router
