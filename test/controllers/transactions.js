const server = require('../../app')
const userFactory = require('../factories/user')
const {dbCleaner, loginUser} = require('../setup')
let user, token

describe('Controller Transactions', () => {
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
  describe('Transactions endpoints', () => {
    it('should create a transaction', async () => {
      const transaction = {
        userId: user.user_id,
        value: 50000,
        points: 10,
        status: 1
      }
      const res = await chai.request(server)
        .post('/api/transactions')
        .set('Authorization', token)
        .send(transaction)
      const {value, points, status} = res.body.result
      expect(res.status).to.eql(200)
      expect(value).to.eql(transaction.value)
      expect(points).to.eql(transaction.points)
      expect(status).to.eql(transaction.status)
    })

    it('should get user transactions', async () => {
      const transaction1 = {
        userId: user.user_id,
        value: 50000,
        points: 10,
        status: 1
      }
      const transaction2 = {
        userId: user.user_id,
        value: 20000,
        points: 5,
        status: 1
      }
      await chai.request(server)
        .post('/api/transactions')
        .set('Authorization', token)
        .send(transaction1)

      await chai.request(server)
        .post('/api/transactions')
        .set('Authorization', token)
        .send(transaction2)

      const res = await chai.request(server)
        .get(`/api/users/${user.user_id}/transactions`)
        .set('Authorization', token)
      const {transactions} = res.body
      expect(res.status).to.eql(200)
      expect(transactions.length).to.eql(2)
      expect(transactions[0].value).to.eql(transaction1.value)
      expect(transactions[0].points).to.eql(transaction1.points)
      expect(transactions[0].status).to.eql(transaction1.status)
      expect(transactions[1].value).to.eql(transaction2.value)
      expect(transactions[1].points).to.eql(transaction2.points)
      expect(transactions[1].status).to.eql(transaction2.status)
    })

    it('should not get user transactions from an unexisting user', async () => {
      const res = await chai.request(server)
        .get(`/api/users/abcsd/transactions`)
        .set('Authorization', token)
      const {transactions} = res.body
      expect(res.status).to.eql(404)
      expect(transactions.body.message).to.eql('sdfds')
    })

    it('should get user points', async () => {
      const transaction1 = {
        userId: user.user_id,
        value: 50000,
        points: 10,
        status: 1
      }
      const transaction2 = {
        userId: user.user_id,
        value: 20000,
        points: 5,
        status: 1
      }

      const transaction3 = {
        userId: user.user_id,
        value: 20000,
        points: 5,
        status: 0
      }

      await chai.request(server)
        .post('/api/transactions')
        .set('Authorization', token)
        .send(transaction1)

      await chai.request(server)
        .post('/api/transactions')
        .set('Authorization', token)
        .send(transaction2)

      await chai.request(server)
        .post('/api/transactions')
        .set('Authorization', token)
        .send(transaction3)

      const res = await chai.request(server)
        .get(`/api/users/${user.user_id}/points`)
        .set('Authorization', token)
      const {points} = res.body
      expect(res.status).to.eql(200)
      expect(points).to.eql(transaction1.points + transaction2.points)
    })

    it('should inactivate transaction', async () => {
      const newTransaction = {
        userId: user.user_id,
        value: 50000,
        points: 10,
        status: 1
      }
      const transactionReturned = await chai.request(server)
        .post('/api/transactions')
        .set('Authorization', token)
        .send(newTransaction)
      const transactionId = transactionReturned.body.result.id
      const res = await chai.request(server)
        .put(`/api/transactions/${transactionId}/inactivate`)
        .set('Authorization', token)
      const {transaction} = res.body
      expect(res.status).to.eql(200)
      expect(parseInt(transaction)).to.eql(transactionId)
    })
  })
})
