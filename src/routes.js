const { Router } = require('express')
const CustomersController = require('./controllers/CustomersController')

const routes = Router()

routes.post('/customers', CustomersController.create)
routes.get('/customers', CustomersController.index)

module.exports = routes
