'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users',
      [{
        name: 'User',
        lastname: 'Initial',
        email: 'initial.user@hotmail.com',
        password: '$2a$10$8SNAMevHGzBQH0mvgobeYuujD.WQmQHwXPsKD6czDx8if6scg1EjG',
        user_id: '876a4e3afb495fc909a5df38bc95b3f2',
        birth_date: new Date(),
        created_date: new Date(),
        updatedAt: new Date()
      }], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {})
  }
}
