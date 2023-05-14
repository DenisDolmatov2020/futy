const app = require('./app');
require('dotenv').config()

const mongoose = require('mongoose')
const DB_URL = process.env.DB_URL

const PORT = process.env.API_PORT

async function startApp() {
    try {
        await mongoose.connect(DB_URL)
        app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT))
    } catch (error) {
        console.log(error)
    }
}

startApp()

