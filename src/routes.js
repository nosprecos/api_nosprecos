const { Router } = require('express')
const CustomersController = require('./controllers/CustomersController')

const routes = Router()

routes.post('/signup', CustomersController.create)
routes.post('/signin', CustomersController.authenticate)
routes.get('/customer/list', CustomersController.getOne)
routes.get('/customers', CustomersController.get)
routes.delete('/customer/remove/:id', CustomersController.remove)
routes.put('/customer/update/:id', CustomersController.create)

module.exports = routes