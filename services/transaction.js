const { User, Transaction } = require('../models')
const excel = require('../libs/excel')

class TransactionService {
  /**
   * Generate a report of the user transactions
   * @param {Integer} userId
   * @returns User created user
   */
  static async exportReport (userId) {
    try {
      const user = await User.findOne({
        where: {
          user_id: userId
        }
      })
      if (user) {
        const transactions = await Transaction.findAll({
          where: {
            userId: user.id
          },
          raw: true
        })
        return await excel.exportExcel(transactions, `${user.name}_${user.lastname}`)
      } else {
        throw new Error(`User with id ${userId} not found`)
      }
    } catch (error) {
      throw error
    }
  }
}
module.exports = TransactionService
