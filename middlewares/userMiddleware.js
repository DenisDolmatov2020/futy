const jwt = require('jsonwebtoken')
const { secret } = require('../config')

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next()
    }

    try {
        console.log(req.headers.authorization)
        const token = req.headers.authorization.split(' ')[1]

        if (!token) {
            return res.status(401).json({ message: 'User not authorized' })
        }
        const decodedData = jwt.verify(token, secret)
        req.user = decodedData.id
        req.body.user = decodedData.id

        next()
    } catch (error) {
        console.log(error)
        return res.status(403).json({ message: 'Error authorization' })
    }
}
