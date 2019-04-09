'use strict'

const { NotFound } = require('http-errors')
const jwt = require('jsonwebtoken')
const jwtSecret = require('../configuration/jwtSecret').secret
const {User} = require('../models')
const UserService = require('../services/user')

class UserController {
  static async list (req, res, next) {
    try {
      req.ability.throwUnlessCan('read', 'User')
      let users = await User.scope({
        method: ['accessibleBy', req.ability]
      }).findAll({
        include: [{
          association: 'role',
          attributes: ['name', 'description']
        }]
      })
      res.status(200).send(users)
    } catch (error) {
      next(error)
    }
  }

  static async retrieve (req, res, next) {
    try {
      let user = await User.findByPk(req.params.userId)
      if (user) {
        res.status(200).send(user)
      } else {
        throw new NotFound('User not found')
      }
    } catch (error) {
      next(error)
    }
  }

  static async create (req, res, next) {
    try {
      let user = await UserService.createUser(req.body)
      res.status(200).send(user)
    } catch (error) {
      next(error)
    }
  }

  static async update (req, res, next) {
    try {
      let user = await User.findByPk(req.params.userId)
      if (user) {
        let userParams = {
          firstName: req.body.firstName || user.firstName,
          lastName: req.body.lastName || user.lastName,
          email: req.body.email || user.email
        }
        if (req.body.password) {
          userParams['password'] = req.body.password
        }
        user = await user.update(userParams)
        res.status(200).send(user)
      } else {
        throw new NotFound('User not found')
      }
    } catch (error) {
      next(error)
    }
  }

  static async destroy (req, res, next) {
    try {
      const user = await User.findByPk(req.params.userId)
      if (user) {
        await user.destroy()
        res.status(204).send()
      } else {
        throw new NotFound('User not found')
      }
    } catch (error) {
      next(error)
    }
  }

  static async authenticate (req, res, next) {
    try {
      const email = req.body.email
      const password = req.body.password
      const user = await User.findOne({
        where: {
          email: email
        }
      })
      if (user && await user.validPassword(password)) {
        const token = jwt.sign({ email: user.email }, jwtSecret, {
          expiresIn: '1d'
        })
        return res.status(200).send({
          token: 'JWT ' + token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          }
        })
      }
      res.status(400).send({
        message: 'Invalid user data'
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = UserController
