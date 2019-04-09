const Sequelize = require('sequelize')

/**
* Initial configuration of the MySQL database
*/
const sequelize = new Sequelize(process.env.MYSQL_URL, {
  dialect: 'mysql',
  pool: {
    max: 50,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established MYSQL')
  })
  .catch(err => {
    console.error('Unable to connect to MYSQL:', err)
  })

module.exports = sequelize
