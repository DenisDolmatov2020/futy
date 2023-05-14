const { Schema, model } = require('mongoose')


const User = new Schema({
    email: {type: String, unique: true, required: true},
    username: {type: String, required: true, unique: false},
    avatar: {type: String},
    password: {type: String, required: true},
    confirmed: {type: Boolean, default: false},
    balance: {type: Number, default: 0}
})

module.exports = model('User', User)
