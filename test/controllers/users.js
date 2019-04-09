const server = require('../../app')
const userFactory = require('../factories/user')
const {dbCleaner, loginUser} = require('../setup')
const crypto = require('crypto')
let user, token

describe('Controller User', () => {
  beforeEach(async () => {
    try {
      await dbCleaner()
      user = await userFactory.create('user')
      token = await loginUser(server, user)
    } catch (error) {
      console.error('Error before each:', error)
    }
  })
  after(async () => {
    await dbCleaner()
  })
  describe('User endpoints', () => {
    it('should register an user', async () => {
      const newUser = {
        name: 'Juan',
        lastname: 'Perez',
        email: 'juan.perez@hotmail.com',
        password: 'password',
        birth_date: new Date()
      }
      const res = await chai.request(server)
        .post('/api/users/register')
        .set('Authorization', token)
        .send(newUser)
      const {name, lastname, email, user_id} = res.body
      expect(res.status).to.eql(200)
      expect(name).to.eql(newUser.name)
      expect(lastname).to.eql(newUser.lastname)
      expect(email).to.eql(newUser.email)
      expect(user_id).to.eql(crypto.createHash('md5').update(email).digest('hex'))
    })

    it('should not register a user already registered', async () => {
      const newUser = {
        name: 'Juan',
        lastname: 'Perez',
        email: 'juan.perez@hotmail.com',
        password: 'password',
        birth_date: new Date()
      }
      await chai.request(server)
        .post('/api/users/register')
        .set('Authorization', token)
        .send(newUser)
      const res2 = await chai.request(server)
        .post('/api/users/register')
        .set('Authorization', token)
        .send(newUser)
      expect(res2.status).to.eql(500)
      expect(res2.body.message).to.eql(`User with email: ${newUser.email} is already registered`)
    })
  })
})
