const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes')
require('dotenv/config')

const app = express()

const urlDB = process.env.URL_DB_MONGO

mongoose.connect(`mongodb+srv://${urlDB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.use(express.json())
app.use(routes)

const port = 3333

app.listen(port)