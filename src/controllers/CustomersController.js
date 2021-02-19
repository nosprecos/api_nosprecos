const axios = require('axios')
const Customers = require('../models/customers')
const {existsOrError, notExistsOrError, equalsOrError, maxMinEquals, securedPassword, verifyEmail} = require('../validation')
const bcrypt = require('bcryptjs')
const error = require('../error-script')
const fs = require('fs')
const { response } = require('express')

module.exports = {

    async authenticate(request, response){
        let {
            userLogin,
            userPassword
        } = request.body

        try{
            existsOrError(userLogin, error.no_login_name)
            existsOrError(userPassword, error.no_password)

            const customer = [await Customers.findOne({userLoginName: userLogin}), 
                             await Customers.findOne({userEmailAddress: userLogin})]

            if(customer[0]){
                if(bcrypt.compareSync(userPassword, customer[0].userPassword))
                    return response.status(200).send(customer[0])
                else
                    throw error.login_failed
            }
            if(customer[1]){
                if(bcrypt.compareSync(userPassword, customer[1].userPassword))
                    return response.status(200).send(customer[1])
                else
                    throw error.login_failed
            }
            else{
                throw error.login_failed
            }
        }
        catch(msg){
                return response.status(400).send(msg)
        }
    },

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
        const id = request.query

        try{
            const customer = await Customers.findOne(id)
            existsOrError(customer, `${error.cant_find_customer} pela id: ${id}`)
            response.status(200).send(customer)
        }
        catch(msg){
            return response.status(400).send(msg)
        } 
    },

    async create(request, response){
        let customer
        const { id } = request.params

        const encryptPassword = password => {
            const salt = bcrypt.genSaltSync(10)
            return hash = bcrypt.hashSync(password, salt)
        }

        let user = request.body
        let {
            userLoginName,
            userRealName,
            userPassword,
            userNewPassword,
            userConfirmPassword,
            userEmailAddress
        } = request.body

        try{

            existsOrError(userPassword, error.no_password)

            if(!id){
                existsOrError(userLoginName, error.no_username)
                existsOrError(userRealName, error.no_realname)
                existsOrError(userConfirmPassword, error.no_confirm_pass)
                existsOrError(userEmailAddress, error.no_email)
            }

            else{
                maxMinEquals('equals', 24, id, error.length_id)
                customer = await Customers.findOne({_id: id})
                existsOrError(customer, `${error.cant_find_customer} pela id: ${id}`)
            }
            console.log(typeof userLoginName)

            if(userLoginName || userLoginName.length == 0){
                
                userLoginName = userLoginName.toLowerCase()
                maxMinEquals('min', 5, userLoginName, error.min_char_user)
                maxMinEquals('max', 30, userLoginName, error.max_char_user)
                const customerLogin = await Customers.findOne({userLoginName: userLoginName})
                notExistsOrError(customerLogin, error.existing_username)
            }

            if(userRealName) maxMinEquals('max', 60, userRealName, error.max_char_name)

            if(userEmailAddress){
                userEmailAddress = userEmailAddress.toLowerCase()
                const customerEmail = await Customers.findOne({userEmailAddress: userEmailAddress})
                notExistsOrError(customerEmail, error.existing_email)
                verifyEmail(userEmailAddress, error.invalid_email)
            }

            if(!id){
                equalsOrError(userPassword, userConfirmPassword, error.mismatch_password)
                securedPassword(3, userPassword, error.not_secured_password)
                userPassword = encryptPassword(userPassword)
                delete userConfirmPassword

                customer = await Customers.create({
                    userLoginName,
                    userRealName,
                    userPassword,
                    userEmailAddress
                })
            }

            if(userNewPassword){
                existsOrError(userConfirmPassword, error.no_confirm_pass)
                equalsOrError(userNewPassword, userConfirmPassword, error.mismatch_password)
                securedPassword(3, userNewPassword, error.not_secured_password)
                user.userPassword = encryptPassword(userNewPassword)
                delete user.userNewPassword
                delete userConfirmPassword
            }

            if(user.userWhatsAppUrl){
                maxMinEquals('max', 15, user.userWhatsAppUrl, error.max_char_WhatsApp)
            }

            if(id && userNewPassword){
                if(bcrypt.compareSync(userPassword, customer.userPassword))
                    customer = await Customers.findOneAndUpdate({_id: id}, user, {new: true})
                else
                    throw error.wrong_password
            }
            else if(id){
                if(bcrypt.compareSync(userPassword, customer.userPassword)){
                    delete user.userPassword
                    customer = await Customers.findOneAndUpdate({_id: id}, user, {new: true})
                }
                else
                    throw error.wrong_password
            }
            
            response.status(200).send(customer)   
        }
        catch(msg){
            return response.status(400).send(msg)
        }
    },

    async remove(request, response){
        const { id } = request.params
        let { userPassword } = request.body
        let customer

        try{
            maxMinEquals('equals', 24, id, error.length_id)
            customer = await Customers.findOne({_id: id})
            existsOrError(customer, `${error.cant_find_customer} pela id: ${id}`)
            existsOrError(userPassword, error.no_password)
            if(bcrypt.compareSync(userPassword, customer.userPassword)){
                customer = await Customers.findOneAndRemove({_id: id})
                response.status(200).send('Usuário deletado com sucesso')
            }
            else
                throw error.login_failed
        }
        catch(msg){
            return response.status(400).send(msg)
        } 
    },

    async photo(req, res){
        const { id } = req.params
        let biData = fs.readFileSync(req.file.path)
        let userProfilePicture = biData.toString('base64') // binary-base64 encoding

        try{
                maxMinEquals('equals', 24, id, error.length_id)
                const customer = await Customers.findOneAndUpdate({_id: id}, userProfilePicture, {new: true})
                existsOrError(customer, `${error.cant_find_customer} pela id: ${id}`)
                res.status(200).send('Foto de usuario atualizada com sucesso')
        }
        catch(msg){
            return res.status(400).send(msg)
        }
    }
}

//const apiResponse = await axios.get('API DO GOOGLE')