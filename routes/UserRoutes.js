const express = require('express')
const UserRouter = express.Router()
const UserController = require('../controllers/user.controller')
const userMiddleware = require('../middlewares/userMiddleware.js')

UserRouter.post('/registration', UserController.registration)
UserRouter.get('/confirm', UserController.confirmEmail)
UserRouter.post('/login', UserController.login)
UserRouter.get('/profile', userMiddleware, UserController.profile)

module.exports = UserRouter
