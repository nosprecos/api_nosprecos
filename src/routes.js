const { Router } = require('express')
const CustomersController = require('./controllers/CustomersController')
const {imgUpload, multer} = require('./controllers/middleware/config-multer')


const routes = Router()

routes.post('/signup', CustomersController.create)
routes.post('/signin', CustomersController.authenticate)
routes.post('/customer/update/photo/:id', function (req, res, next){
    multer(imgUpload).single('picture')(req, res, async function(err){
        if (err instanceof multer.MulterError) return res.status(400).send(err.field)
        else if(err) return res.status(400).send(err)
        next()
    })
}, CustomersController.photo)

routes.get('/customer/list', CustomersController.getOne)
routes.get('/customers', CustomersController.get)
routes.delete('/customer/remove/:id', CustomersController.remove)
routes.put('/customer/update/:id', CustomersController.create)

module.exports = routes