const TransactionService = require('../services/transaction')
const { Transaction, User } = require('../models')
const { NotFound } = require('http-errors')

class TransactionsController {
  /**
   *Creates a transaction
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns the new transaction
   * @memberof TransactionsController
   */
  static async create (req, res, next) {
    try {
      const {userId} = req.body
      const user = await User.findOne({where: {user_id: userId}})
      if (!user) {
        throw new NotFound('User not found')
      }
      delete req.body.userId
      const result = await user.createTransaction(req.body)
      res.status(200).send({
        result
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get transactions of an user
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns array of transactions
   * @memberof TransactionsController
   */
  static async getTransactions (req, res, next) {
    try {
      const {userId} = req.params
      const user = await User.findOne({where: {user_id: userId}})
      if (!user) {
        throw new NotFound('User not found')
      }
      const transactions = await user.getTransactions({
        order: [['createdAt', 'DESC']],
        raw: true
      })
      res.status(200).send({
        transactions
      })
    } catch (error) {
      next(error)
    }
  }

  /**
    * Get user active trasaction points
    * @static
    * @param {*} req
    * @param {*} res
    * @param {*} next
    * @returns transaction id of the inactivated transaction
    * @memberof TransactionsController
    */
  static async getUserPoints (req, res, next) {
    try {
      const {userId} = req.params
      const user = await User.findOne({where: {user_id: userId}})
      if (!user) {
        throw new NotFound('User not found')
      }
      const points = await Transaction.getUserPoints(user.id)
      res.status(200).send({
        points
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Inactivate an user transaction
    * @static
    * @param {*} req
    * @param {*} res
    * @param {*} next
    * @returns transaction id of the inactivated transaction
    * @memberof TransactionsController
    */
  static async inactivateTransaction (req, res, next) {
    try {
      const {transactionId} = req.params
      const transaction = await Transaction.inactivateTransaction(transactionId)
      if (!transaction) {
        throw new NotFound('Transaction not found')
      }
      res.status(200).send({
        transaction
      })
    } catch (error) {
      next(error)
    }
  }

  /**
  * Generate the user report
  * @static
  * @param {*} req
  * @param {*} res
  * @param {*} next
  * @returns user xlsx report
  * @memberof TransactionsController
  */
  static async getUserReport (req, res, next) {
    try {
      const {userId} = req.params
      const report = await TransactionService.exportReport(userId)
      res.attachment('report.xlsx')
      return res.status(200).send(report)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = TransactionsController
