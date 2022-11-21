const User = require('../schemes/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator')
const {secret} = require('../config.js')
const UserService = require('../services/user.service.js')

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"} )
}

class UserController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new Error('new', { errors })
                // return res.status(400).json({message: "", })
            }

            await UserService.create(req.body, req.files?.avatar)
            return res.json({message: "Registration successful"})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: e.message})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({message: `Пользователь ${username} не найден`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: `wrong password`})
            }
            const token = generateAccessToken(user._id)
            return res.json({token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'login error'})
        }
    }

    async list(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new UserController()