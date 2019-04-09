'use strict'

const { DATE, FLOAT, INTEGER, fn, col } = require('sequelize')
const BaseModel = require('./baseModel')

class Transaction extends BaseModel {
  static get schema () {
    return {
      value: {
        type: FLOAT,
        allowNull: false
      },
      points: {
        type: INTEGER,
        allowNull: false
      },
      status: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          max: 1,
          min: 0
        }
      },
      createdAt: {
        allowNull: false,
        field: 'created_date',
        type: DATE
      },
      updatedAt: {
        allowNull: false,
        type: DATE
      }
    }
  }

  /**
   * Initializes the model
   * @param {Sequelize} sequelize initial configuration
   */
  static init (sequelize) {
    return super.init(this.schema, {
      timestamps: true,
      tableName: 'transactions',
      sequelize,
      hooks: this.hooks
    })
  }

  /**
   * Associate the different models
   * @param {Sequelize models} models
   */
  static associate (models) {
    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    })
  }

  /**
   *Generate the hook triggers of the model
   * @readonly
   * @static
   * @memberof User
   */
  static get hooks () {
    return {
    }
  }

  /**
   * Gets the user total points from his or her transactions
   * @param {String} userId
   * @returns totalPoints
   */
  static async getUserPoints (userId) {
    try {
      let points = 0
      const transactions = await this.findAll({
        where: {
          userId,
          status: 1
        },
        attributes: [[fn('sum', col('points')), 'total_points']],
        raw: true
      })
      if (transactions && transactions[0]) {
        points = parseInt(transactions[0].total_points)
      }
      return points
    } catch (error) {
      throw error
    }
  }

  /**
   * Inactivate a user transaction
   * @param {INTEGER} transactionId
   * @returns transaction id of the updated transaction
   */
  static async inactivateTransaction (transactionId) {
    try {
      const transaction = await this.update({
        status: 0
      }, {
        where: {
          id: transactionId
        }
      })
      if (transaction) {
        return JSON.stringify(JSON.parse(transaction))
      }
      return null
    } catch (error) {
      throw error
    }
  }
}

module.exports = Transaction
