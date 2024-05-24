const express = require('express')
const UserRouter = express.Router()
const UserController = require('../controllers/user.controller')
const userMiddleware = require('../middlewares/userMiddleware.js')

UserRouter.post('/authenticate-metamask', UserController.authenticateWithMetaMask)
UserRouter.post('/registration', UserController.registration)
UserRouter.get('/confirm', UserController.confirmEmail)
UserRouter.post('/login', UserController.login)
UserRouter.get('/profile', userMiddleware, UserController.profile)
UserRouter.patch('/profile', userMiddleware, UserController.updateProfile)
UserRouter.patch('/password', userMiddleware, UserController.updatePassword)

module.exports = UserRouter
