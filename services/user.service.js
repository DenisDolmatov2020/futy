const User = require('../models/User.js')
const bcrypt = require('bcryptjs')

class UserService {
    async create(user) {
        console.log(user)
        const {email, username, password} = user
        const candidate = await User.findOne({email})
        console.log('++', candidate)
        if (candidate) {
            throw new Error('Email ready')
        }
        const hashPassword = bcrypt.hashSync(password, 7);
        return User.create({email, username, password: hashPassword})
    }

    async list() {
        return User.find({ showAt: {$lte: new Date() }}).populate('user', {'password': 0})
    }

    async detail(id) {
        if (!id) {
            throw new Error('не указан ID')
        }
        return User.findById(id, {'password': 0})
    }

    async update(User) {
        if (!User._id) {
            throw new Error('не указан ID')
        }
        return User.findByIdAndUpdate(User._id, User, {new: true})
    }

    async delete(id) {
        if (!id) {
            throw new Error('не указан ID')
        }
        return User.findByIdAndDelete(id)
    }
}


module.exports = new UserService()
