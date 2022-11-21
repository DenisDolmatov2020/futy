const { Schema, model } = require('mongoose')


const User = new Schema({
    email: {type: String, unique: true, required: true,},
    username: {type: String, required: true},
    avatar: {type: String},
    password: {type: String, required: true},
})

module.exports = model('User', User)
