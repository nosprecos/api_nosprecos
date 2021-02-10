const { Router } = require('express')
const CustomersController = require('./controllers/CustomersController')

const routes = Router()

routes.post('/signup', CustomersController.create)
routes.post('/signin', CustomersController.authenticate)
routes.get('/customer', CustomersController.getOne)
routes.get('/customers', CustomersController.get)
routes.delete('/customer/:id', CustomersController.remove)

module.exports = routes