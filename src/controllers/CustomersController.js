const axios = require('axios')
const Customers = require('../models/customers')
const {existsOrError, notExistsOrError, equalsOrError} = require('../validation')

module.exports = {
    async index(request, response){
        const customers = await Customers.find()

        return response.json(customers)
    },

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

        try{
            
            existsOrError(userLoginName, 'Login de usuario nao informado')
            existsOrError(userRealName, 'Nome de usuario nao informado')
            existsOrError(userPassword, 'Senha de usuario nao informado')
            existsOrError(userEmailAddress, 'Email de usuario nao informado')
            
            const customerLogin = await Customers.findOne({userLoginName})
            const customerEmail = await Customers.findOne({userEmailAddress})

            notExistsOrError(customerLogin, 'Login de usuario ja utilizado')
            notExistsOrError(customerEmail, 'Email de usuario ja utilizado')
              
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

            response.status(200).send(customer)   
        }
        catch(msg){
            return response.status(400).send(msg)
        }
    }
}

//const apiResponse = await axios.get('API DO GOOGLE')