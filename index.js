const express = require('express')

const app = express()

app.use(express.json())

const port = 3333

app.get('/', (request, response) => {
    return response.json({message: 'Hello, Gesio'})
})

app.listen(port)