const { Router } = require('express')
const axios = require('axios')
const Customers = require('./models/customers')

const routes = Router()

routes.post('/customers', async (request, response) => {

    const {
        userLoginName,
        userRealName,
        userPassword,
        userState,
        userEmailAddress,
        userWhatsAppUrl,
        userInstagramUrl,
        userFacebookUrl
    } = request.body

    //const apiResponse = await axios.get('API DO GOOGLE')

    const customer = await Customers.create({
        userLoginName,
        userRealName,
        userPassword,
        userState,
        userEmailAddress,
        userWhatsAppUrl,
        userInstagramUrl,
        userFacebookUrl
    })

    return response.json(customer)
})

module.exports = routes