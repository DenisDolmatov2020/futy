const PostService = require("../services/post.service.js");

class PostController {
    async create(req, res) {
        try {
            const post = await PostService.create(req.body, req.files?.file)
            res.json()
        } catch (e) {
            console.error(e)
            res.status(500).json(e)
        }
    }

    async list(req, res) {
        try {
            const posts = await PostService.list();
            return res.json(posts);
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async detail(req, res) {
        try {
            const post = await PostService.detail(req.params.id)
            return res.json(post)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async update(req, res) {
        try {
            const updatedPost = await PostService.update(req.body);
            return res.json(updatedPost);
        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    async delete(req, res) {
        try {
            const post = await PostService.delete(req.params.id);
            return res.json({ message: 'post deleted', ...post })
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async deleteAll(req, res) {
        try {
            await PostService.deleteAll();
            return res.json({ message: 'all posts deleted'})
        } catch (e) {
            res.status(500).json(e)
        }
    }
}

module.exports = new PostController()