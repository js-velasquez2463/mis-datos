const factoryGirl = require('factory-girl')
const factory = factoryGirl.factory
const { User } = require('../../models')

factory.define('user', User, {
  name: factory.seq('User.firstName', (n) => `Johan ${n}`),
  lastname: factory.seq('User.flastName', (n) => `Velasquez ${n}`),
  email: factory.chance('email'),
  password: 'password',
  birth_date: new Date(),
  user_id: factory.chance('string')
})

module.exports = factory
