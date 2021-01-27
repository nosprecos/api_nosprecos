const axios = require('axios')
const Customers = require('../models/customers')

module.exports = {
    async create(request, response){

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

        let customer = 'Usuário já cadastrado'

        const customerLogin = await Customers.findOne({userLoginName})
        const customerEmail = await Customers.findOne({userEmailAddress})

        if (!customerLogin && !customerEmail){

            //const apiResponse = await axios.get('API DO GOOGLE')
    
                customer = await Customers.create({
                userLoginName,
                userRealName,
                userPassword,
                userState,
                userEmailAddress,
                userWhatsAppUrl,
                userInstagramUrl,
                userFacebookUrl
            })
        }

        return response.json(customer)
    }
}