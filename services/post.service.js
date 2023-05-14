const Post = require("../models/Post.js")
const fileService = require("./file.service.js")

class PostService {
    async create(post, file) {
        let fileName = ''
        if (file) {
            fileName = fileService.saveFile(file)
        }

        return await Post.create({...post, file: fileName})
    }

    async list() {
        return Post.find({ showAt: {$lte: new Date() }}).populate('user', {'password': 0})
    }

    async detail(id) {
        if (!id) {
            throw new Error('не указан ID')
        }
        return Post.findById(id).populate('user', {'password': 0})
    }

    async update(post) {
        if (!post._id) {
            throw new Error('не указан ID')
        }
        return Post.findByIdAndUpdate(post._id, post, {new: true})
    }

    async delete(id) {
        if (!id) {
            throw new Error('не указан ID')
        }
        return Post.findByIdAndDelete(id)
    }

    async deleteAll() {
        return Post.deleteMany()
    }
}


module.exports = new PostService()
