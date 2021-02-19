const { Router } = require('express')
const CustomersController = require('./controllers/CustomersController')
let file = require('./controllers/middleware/config-multer')
const multer = require('multer')


const routes = Router()

routes.post('/signup', CustomersController.create)
routes.post('/signin', CustomersController.authenticate)
routes.post('/customer/update/photo/:id', file.imgUpload.single('picture'), CustomersController.photo)

routes.get('/customer/list', CustomersController.getOne)
routes.get('/customers', CustomersController.get)
routes.delete('/customer/remove/:id', CustomersController.remove)
routes.put('/customer/update/:id', CustomersController.create)

module.exports = routes