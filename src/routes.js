const { Router } = require('express')
const CustomersController = require('./controllers/CustomersController')

const routes = Router()

routes.post('/customers', CustomersController.create)
routes.get('/customers/:id', CustomersController.getOne)
routes.get('/customers/', CustomersController.get)

module.exports = routes