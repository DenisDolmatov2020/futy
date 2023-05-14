const PostController = require('../controllers/post.controller.js')
const userMiddleware = require('../middlewares/userMiddleware.js')

const Router = require('express')
const PostRoutes = new Router()

PostRoutes.post('/posts', userMiddleware, PostController.create)
PostRoutes.get('/posts', PostController.list)
PostRoutes.get('/posts/:id', PostController.detail)
PostRoutes.put('/posts', PostController.update)
PostRoutes.delete('/posts/:id', PostController.delete)
PostRoutes.delete('/posts', PostController.deleteAll)

module.exports = PostRoutes
