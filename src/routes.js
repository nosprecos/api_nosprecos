const { Router } = require('express')
const CustomersController = require('./controllers/CustomersController')
let file = require('./controllers/middleware/config-multer')



const routes = Router()

routes.post('/signup', CustomersController.create)
routes.post('/signin', CustomersController.authenticate)
routes.post('/customer/update/photo/:id', function(req, res, next){
    file.imgUpload.single('picture')(req, res, function(err){
        if (err) res.status(400).send('err')
        else next()
    })
}, CustomersController.photo)

routes.get('/customer/list', CustomersController.getOne)
routes.get('/customers', CustomersController.get)
routes.delete('/customer/remove/:id', CustomersController.remove)
routes.put('/customer/update/:id', CustomersController.create)

module.exports = routes