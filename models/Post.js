const { Schema, model } = require('mongoose');

const Post = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    message: { type: String },
    file: { type: String },
    changeable: { type: Boolean, default: false, required: true },
    showAt: { type: 'Date', format: 'date-time', required: true },
}, { timestamps: true })

module.exports = model('Post', Post)