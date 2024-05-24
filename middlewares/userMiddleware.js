const jwt = require('jsonwebtoken')
const { secret } = require('../config')

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]

        if (!token) {
            return res.status(401).json({ message: 'User not authorized' })
        }
        const decodedData = jwt.verify(token, secret)
        if (!req.body?.anonymous) {
            req.userId = decodedData.id
            req.body.userId = decodedData.id
        }

        next()
    } catch (error) {
        console.error(error.message)
        return res.status(401).json({ message: error?.message || 'Error authorization' })
    }
}
