const { User } = require('../models')
const crypto = require('crypto')

class UserService {
  /**
   * Creates an user from a Json body
   * @param {JSON} userBody
   * @returns User created user
   */
  static async createUser (userBody) {
    try {
      if (userBody.email) {
        const userId = crypto.createHash('md5').update(userBody.email).digest('hex')
        let user = await User.findOne({ where: { user_id: userId } })
        if (user) {
          throw new Error(`User with email: ${userBody.email} is already registered`)
        }
        user = await User.create({
          ...userBody,
          user_id: userId
        })
        return user
      } else {
        throw new Error('Email must not be null')
      }
    } catch (error) {
      console.log('error', error)
      throw error
    }
  }
}
module.exports = UserService
