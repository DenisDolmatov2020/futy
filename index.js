const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const router =  require("./router.js")
const fileUpload = require('express-fileupload')

const PORT = 8000
const DB_URL = 'mongodb+srv://futy:1rwMkerlb3O0U3Zp@cluster0.ic2wpi0.mongodb.net/?retryWrites=true&w=majority'

const app = express()

app.use(express.json())
app.use(express.static('static'))
const {secret} = require('./config')

const cors = require('cors')

app.use(cors())
/*
app.use((req, res, next) => {
    console.log(req.headers)
    const authToken = req.headers['authorization']
    console.log('Auth', authToken)
    if (authToken) {
        try {
            const decoded = jwt.verify(authToken, secret)
            console.log('decoded', decoded)
            req.user = decoded.id
            console.log('req', req.user)
            // Hopefully
            // req.user = getUserById(decoded.userId)
            next()
        } catch(e) {
            // Handle Errors or renewals
            req.user = null
            console.error(e)
            // You could either next() to continue or use 'res' to respond something
        }

    } else {
        // Throw 403 if should be authorized
        res.sendStatus(403)
    }
})
*/
app.use(fileUpload({}))
app.use('/api', router)

async function startApp() {
    try {
        await mongoose.connect(DB_URL)
        app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT))
    } catch (e) {
        console.log(e)
    }
}

startApp()

