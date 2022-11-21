const Router = require('express')
const PostController = require("./controllers/post.controller.js")
const UserController =  require("./controllers/user.controller.js")

const {check} = require("express-validator")
const userMiddleware = require('./middlewares/userMiddleware.js')

const router = new Router()


router.post('/registration', [
    check('username', "Имя пользователя не может быть пустым").notEmpty(),
    check('password', "Пароль должен быть больше 4 и меньше 10 символов").isLength({min:4, max:10})
], UserController.registration)
router.post('/login', UserController.login)
router.get('/users', UserController.list)

router.post('/posts', userMiddleware, PostController.create)
router.get('/posts', PostController.list)
router.get('/posts/:id', PostController.detail)
router.put('/posts', PostController.update)
router.delete('/posts/:id', PostController.delete)
router.delete('/posts', PostController.deleteAll)

module.exports = router