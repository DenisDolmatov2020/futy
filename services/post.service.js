const Post = require("../models/Post.js")

class PostService {
    create(postData, filesData) {
        postData.files = filesData.map(file => file.filename);
        return Post.create(postData);
    }

    async list() {
        return Post.find({ nextShowAt: {$lte: new Date() }}).populate('user', 'username')
    }

    async closed() {
        return Post.find({ nextShowAt: {$gte: new Date() }}).populate('user', 'username')
    }

    async myCaps(id) {
        return Post.find({ user: id }).sort({ createdAt: -1 })
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
