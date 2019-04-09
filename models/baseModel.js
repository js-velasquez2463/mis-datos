'use strict'

const Sequelize = require('sequelize')

class BaseModel extends Sequelize.Model {
  /**
   *Initialize the models
   * @static
   * @param {*} schema
   * @param {*} options
   * @returns the base model
   * @memberof BaseModel
   */
  static init (schema, options) {
    return super.init(schema, options)
  }
}

module.exports = BaseModel
