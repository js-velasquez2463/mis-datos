
const { exec } = require('child_process')
// load test env variables
const dotenv = require('dotenv').config({
  path: './configuration/envs/test.env'
})

describe('Integration Tests', () => {
  require('./controllers/users')
  require('./controllers/transactions')
})
