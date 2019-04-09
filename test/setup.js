if (process.env.NODE_ENV) {
  require('../configuration/envs/config')
}
const map = require('lodash/map')
const {Transaction, User} = require('../models')
const pry = require('pryjs')
const chai = require('chai')
const chaiHttp = require('chai-http')

const dbCleaner = async () => {
  try {
    await Transaction.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true
    })
    await User.destroy({
      where: {},
      cascade: true,
      restartIdentity: true
    })
  } catch (error) {
    console.log('[dbCleaner]', error.message)
  }
}

const loginUser = async (app, user) => {
  return chai
    .request(app)
    .post('/api/authenticate')
    .send({
      email: user.email,
      password: 'password'
    })
    .then((res) => {
      return res.body.token
    })
}

chai.use(chaiHttp)
global.pry = pry
global.chai = chai
global.expect = chai.expect
global.dbCleaner = dbCleaner
global.loginUser = loginUser

module.exports = {
  dbCleaner,
  loginUser
}
