'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const sequelize = require('../configuration/mysql')

/**
 * Load the models into the server
 */
const db = Object.assign({}, ...fs.readdirSync(__dirname).filter(
  file => (file.indexOf('.') !== 0) && (file !== 'index.js') && (file !== 'baseModel.js'))
  .map((file) => {
    const model = require(path.join(__dirname, file))
    return {
      [model.name]: model.init(sequelize)
    }
  }
  ))

/**
 * Associate the models in the application
 */
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
