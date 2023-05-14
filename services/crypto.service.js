const jwt = require('jsonwebtoken')
const { secret } = require('../config.js')


class CryptoService {
    generateAccessToken = id => {
        return jwt.sign({ id }, secret, { expiresIn: '24h' } )
    }
}


module.exports = new CryptoService()
