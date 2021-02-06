const axios = require('axios')
const Customers = require('../models/customers')
const {existsOrError, notExistsOrError, equalsOrError, maxMin, securedPassword} = require('../validation')
const bcrypt = require('bcryptjs')
const error = require('../error-script')

module.exports = {

    async get(request, response){
        try{
            const customer = await Customers.find()
            existsOrError(customer, error.cant_find_customer)
            response.status(200).send(customer)
        }
        catch(msg){
            return response.status(400).send(msg)
        }
    },

    async getOne(request, response){
        const { id } = request.params
        
        try{
            const customer = await Customers.findOne({_id: id})
            existsOrError(customer, error.cant_find_customer + ' by id: ' + id)
            response.status(200).send(customer)
        }
        catch(msg){
            return response.status(400).send(msg)
        } 
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
            
            existsOrError(userLoginName, error.no_username)
            existsOrError(userRealName, error.no_realname)
            existsOrError(userPassword, error.no_password)
            existsOrError(userEmailAddress, error.no_email)

            equalsOrError(userPassword, userConfirmPassword, error.mismatch_password)

            securedPassword(3, userPassword, error.not_secured_password)

            userLoginName = userLoginName.toLowerCase()
            userEmailAddress = userEmailAddress.toLowerCase()

            maxMin('min', 5, userLoginName, error.min_char_user)
            maxMin('max', 30, userLoginName, error.max_char_user)

            maxMin('max', 60, userRealName, error.max_char_name)
            
            const customerLogin = await Customers.findOne({userLoginName})
            const customerEmail = await Customers.findOne({userEmailAddress})
            
            notExistsOrError(customerLogin, error.existing_username)
            notExistsOrError(customerEmail, error.existing_email)

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