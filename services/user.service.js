const User = require('../models/User.js')
const bcrypt = require('bcryptjs')
const CryptoService = require('./crypto.service')

class UserService {
    async create({ username, email, encryptedPrivateKey, salt, password }) {
        // Хеширование пароля
        const candidate = await User.findOne({email})

        if (candidate) {
            throw new Error('Email ready')
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        // Сохранение пользователя в базе данных (псевдокод)
        const newUser = new User({
            username,
            email,
            encryptedPrivateKey,
            salt,
            password: hashedPassword
        })

        await newUser.save()
    }

    async detail({ email, password }) {
        // Поиск пользователя и проверка пароля
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found')
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials')
        }
        // Генерация JWT токена
        const token = CryptoService.generateAccessToken(user._id)

        return {
            email: user.email,
            address: user.address,
            salt: user.salt,
            encryptedPrivateKey: user.encryptedPrivateKey,
            token
        }
    }

    async update(data) {
        const user = await User.findOne({ _id: data.userId });

        if (!user) {
            let error = new Error('User not found')
            error.status = 404
            throw error
        }
        return User.findByIdAndUpdate(data.userId, data, {new: true})
    }
}


module.exports = new UserService()
