'use strict'

const { STRING, DATE } = require('sequelize')
const BaseModel = require('./baseModel')
const bcrypt = require('bcrypt-nodejs')

class User extends BaseModel {
  static get schema () {
    return {
      user_id: {
        type: STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: STRING,
        allowNull: false
      },
      lastname: {
        type: STRING,
        allowNull: false
      },
      birth_date: {
        type: DATE
      },
      email: {
        type: STRING,
        allowNull: false,
        validate: {
          isEmail: true
        },
        unique: {
          args: true,
          msg: 'Email address already in use!'
        }
      },
      password: {
        type: STRING,
        allowNull: false,
        validate: {
          len: {
            args: [6, 255],
            msg: 'Password should be between 6 and 255 characters'
          }
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
   * Initialize the model
   * @param {Sequelize} sequelize initial configuration
   */
  static init (sequelize) {
    return super.init(this.schema, {
      timestamps: true,
      tableName: 'users',
      sequelize,
      hooks: this.hooks
    })
  }

  /**
   * Associate the different models
   * @param {Sequelize models} models
   */
  static associate (models) {
    this.hasMany(models.Transaction, {
      foreignKey: 'userId',
      as: 'transactions'
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
      beforeCreate: [this.bcryptPassword],
      beforeUpdate: [this.changePassword]
    }
  }

  /**
   * Cipher the user password
   * @static
   * @param {User} user
   * @memberof User
   */
  static async bcryptPassword (user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null)
  }

  /**
   * Update and cipher the user password
   * @static
   * @param {*} user
   * @memberof User
   */
  static async changePassword (user) {
    if (user.changed('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null)
    }
  }

  /**
   *Validate the user password for login
   * @param {String} password
   * @returns if the password is valid or not
   * @memberof User
   */
  async validPassword (password) {
    return bcrypt.compareSync(password, this.password)
  }

  /**
   *Return the user model deleting the password from the object
   * @returns User
   * @memberof User
   */
  toJSON () {
    let values = Object.assign({}, this.get())
    delete values.password
    return values
  }
}

module.exports = User
