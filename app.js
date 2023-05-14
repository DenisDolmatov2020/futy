const express = require('express')
const cors = require('cors')
const UserRoutes = require('./routes/UserRoutes')
const PostRoutes = require('./routes/PostRoutes')

const {secret} = require('./config')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('static'))
app.use('/api/user', UserRoutes)
app.use('/api/post', PostRoutes)

module.exports = app;
