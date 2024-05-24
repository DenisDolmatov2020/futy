const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const User = require('../models/User')
const UserService = require('../services/user.service.js')
const SMPTService = require('../services/smpt.service')
const CryptoService = require('../services/crypto.service')
const { ethers} = require('ethers')


class UserController {
    async authenticateWithMetaMask(req, res) {
        try {
            const { address, signature } = req.body
            const message = `Authenticate with address: ${address}`

            if (!address || !signature) {
                return res.status(401).json({ message: 'Invalid signature or address' })
            }

            const recoveredAddress = ethers.verifyMessage(message, signature)
            if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
                return res.status(401).json({ message: 'Invalid signature' })
            }

            let user = await User.findOne({ address })
            if (!user && address) {
                // Если пользователь не существует, создаем нового пользователя
                user = await User.create({ email: address })
            }

            console.log('USER', user)
            const token = CryptoService.generateAccessToken(user._id)
            return res.json({ token })
        } catch (error) {
            console.error(error)
            res.status(400).json({ message: 'Authentication error', error: error.message })
        }
    }

    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors })
            }

            await UserService.create(req.body)
            await SMPTService.sendConfirmationEmail(req.body.email)
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
            console.log('U ID', req.userId)
            // Найти пользователя по идентификатору, сохраненному в поле userId в токене
            const user = await User.findOne({ _id: req.userId })

            console.log('U ID', user)
            // Возвращаем только необходимые данные пользователя
            const { username, email, confirmed, about } = user
            res.status(200).json({ username, email, confirmed, about })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Server error', error })
        }
    }

    async updateProfile(req, res) {
        try {
            // Найти пользователя по идентификатору, сохраненному в поле userId в токене
            const user = await User.findOne({ _id: req.userId });

            // Если пользователь не найден, вернуть ошибку
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Обновить данные пользователя с помощью данных из запроса
            const { username, email, about } = req.body;

            if (username) user.username = username;
            if (email) user.email = email;
            if (about) user.about = about;

            // Сохранить обновленные данные пользователя в базе данных
            await user.save();
            res.status(200).json({ message: 'Profile was updated'});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error', error });
        }
    }


    async updatePassword(req, res) {
        try {
            // Найти пользователя по идентификатору, сохраненному в поле userId в токене
            const user = await User.findOne({ _id: req.userId });

            // Если пользователь не найден, вернуть ошибку
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const { oldPassword, newPassword } = req.body;

            // Проверить, совпадает ли старый пароль
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Incorrect old password' });
            }

            // Хешировать новый пароль и сохранить его
            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();

            res.status(200).json({ message: 'Password was updated' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error', error });
        }
    }

}

module.exports = new UserController()
