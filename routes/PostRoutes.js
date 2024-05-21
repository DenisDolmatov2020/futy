const PostController = require('../controllers/post.controller.js')
const userMiddleware = require('../middlewares/userMiddleware.js')

const Router = require('express');

const multer = require('multer');
const PostRoutes = new Router()

// Настройка multer для хранения файлов
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/uploads/') // Указывайте путь к папке, где будут храниться файлы
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop())
    }
});

const upload = multer({ storage: storage });

PostRoutes.post('/', userMiddleware, upload.array('files'), PostController.create)
PostRoutes.get('/', PostController.list)
PostRoutes.get('/closed', PostController.closed)
PostRoutes.get('/my-caps', userMiddleware, PostController.myCaps)
PostRoutes.get('/:id', PostController.detail)
PostRoutes.put('/', PostController.update)
PostRoutes.delete('/:id', PostController.delete)
PostRoutes.delete('/', PostController.deleteAll)

module.exports = PostRoutes
