const { Router } = require('express')
const CustomersController = require('./controllers/CustomersController')

const routes = Router()

routes.post('/customers', CustomersController.create)
routes.get('/customers/:id', CustomersController.index)
//routes.get('/customers/id', CustomersController.findOne)

module.exports = routes