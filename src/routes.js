const { Router } = require('express')
const CustomersController = require('./controllers/CustomersController')

const routes = Router()

routes.post('/signup', CustomersController.create)
routes.post('/signin', CustomersController.authenticate)
routes.get('/customers/:id', CustomersController.getOne)
routes.get('/customers/', CustomersController.get)

module.exports = routes