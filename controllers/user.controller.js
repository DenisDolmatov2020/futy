const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const User = require('../models/User')
const UserService = require('../services/user.service.js')
const SMPTService = require('../services/smpt.service')
const CryptoService = require('../services/crypto.service')

class UserController {
    async registration(req, res) {
        try {
            console.log('REQ', req.body)
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors })
            }

            await UserService.create(req.body)
            // await SMPTService.sendConfirmationEmail(req.body)
            return res.json({ message: 'Registration successful' })
        } catch (error) {
            console.error(error)
            res.status(400).json({ message: error.message })
        }
    }

    async login(req, res) {
        try {
            const {email, password} = req.body
            const user = await User.findOne({email})
            if (!user) {
                return res.status(401).json({ message: `User with email ${email} not found`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(401).json({ message: 'Email and password mismatch' })
            }
            const token = CryptoService.generateAccessToken(user._id)
            return res.json({ token })
        } catch (error) {
            console.error(error)
            res.status(400).json({ message: 'login error' })
        }
    }

    async confirmEmail(req, res) {
        try {
            const { email } = req.query

            const user = await User.findOne({ email })

            if (!user) {
                return res.status(404).send({ message: 'User not found' })
            }

            if (user.confirmed) {
                return res.status(400).send({ message: 'Email already confirmed' })
            }

            // Update confirmation user in DB
            user.set('confirmed', true)
            await user.save()

            return res.status(200).send({ message: 'Email confirmed successfully' })
        } catch (error) {
            console.error(error)

            return res.status(500).send({ message: 'Server error' })
        }
    }

    async profile (req, res) {
        try {
            // Найти пользователя по идентификатору, сохраненному в поле userId в токене
            const user = await User.findOne({ id: req.userId })
            // Возвращаем только необходимые данные пользователя
            const { username, email, confirmed } = user
            res.status(200).json({ username, email, confirmed })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Server error', error })
        }
    }
}

module.exports = new UserController()
