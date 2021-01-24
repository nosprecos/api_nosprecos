const { Router } = require('express')

const routes = Router()

routes.post('/customers', (request, response) => {
    console.log(request.body)
    return response.json({message: 'Hello, Gesio'})
})

module.exports = routes