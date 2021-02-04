const axios = require('axios')
const Customers = require('../models/customers')
const {existsOrError, notExistsOrError, equalsOrError, maxMin} = require('../validation')
const bcrypt = require('bcryptjs')

module.exports = {
    async index(request, response){
        const customers = await Customers.find()

        return response.json(customers)
    },

    async create(request, response){

        const encryptPassword = password => {
            const salt = bcrypt.genSaltSync(10)
            return hash = bcrypt.hashSync(password, salt)
        }

        let {
            userLoginName,
            userRealName,
            userPassword,
            userConfirmPassword,
            userState,
            userEmailAddress
        } = request.body

        try{
            
            existsOrError(userLoginName, 'Login de usuário nao informado')
            existsOrError(userRealName, 'Nome de usuario nao informado')
            existsOrError(userPassword, 'Senha de usuario nao informado')
            existsOrError(userEmailAddress, 'Email de usuario nao informado')

            equalsOrError(userPassword, userConfirmPassword, 'Senhas não são iguais')

            userLoginName = userLoginName.toLowerCase()
            userEmailAddress = userEmailAddress.toLowerCase()

            maxMin('min', 5, userLoginName, 'Login de usuário não atinge valor mínimo')
            maxMin('max', 30, userLoginName, 'Login de usuário passou do valor máximo')

            maxMin('max', 60, userRealName, 'Nome de usuário passou do valor máximo')

            maxMin('min', 8, userPassword, 'Senha de usuário não atinge valor mínimo')
            maxMin('max', 60, userPassword, 'Senha de usuário passou do valor máximo')
            
            const customerLogin = await Customers.findOne({userLoginName})
            const customerEmail = await Customers.findOne({userEmailAddress})
            
            notExistsOrError(customerLogin, 'Login de usuario ja utilizado')
            notExistsOrError(customerEmail, 'Email de usuario ja utilizado')

            userPassword = encryptPassword(userPassword)
            delete userConfirmPassword
              
            customer = await Customers.create({
                    userLoginName,
                    userRealName,
                    userPassword,
                    userState,
                    userEmailAddress
                })

            response.status(200).send(customer)   
        }
        catch(msg){
            return response.status(400).send(msg)
        }
    }
}

//const apiResponse = await axios.get('API DO GOOGLE')