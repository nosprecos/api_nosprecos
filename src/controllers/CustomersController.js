const axios = require('axios')
const Customers = require('../models/customers')
const { existsOrError, exists, notExistsOrError, cleanUndefNull, equalsOrError,
    maxMinEqualsLength, securedPassword, verifyEmail, hasValidAscii } = require('../validation')
const bcrypt = require('bcryptjs')
const error = require('../error-script')
const { prepImg } = require('../utils/utils')
const ID_LENGTH_DB = 24

module.exports = {
    async authenticate(req, res) {
        let {
            userLogin,
            userPassword
        } = req.body

        try {
            existsOrError(userLogin, error.NO_LOGIN_NAME)
            existsOrError(userPassword, error.NO_PASSWORD)

            const customer = [await Customers.findOne({ userLoginName: userLogin }),
            await Customers.findOne({ userEmailAddress: userLogin })]

            if (customer[0]) {
                if (bcrypt.compareSync(userPassword, customer[0].userPassword))
                    return res.status(200).send(customer[0])
                else
                    throw error.LOGIN_FAILED
            }
            if (customer[1]) {
                if (bcrypt.compareSync(userPassword, customer[1].userPassword))
                    return res.status(200).send(customer[1])
                else
                    throw error.LOGIN_FAILED
            }
            else {
                throw error.LOGIN_FAILED
            }
        }
        catch (msg) {
            return res.status(400).send(msg)
        }
    },

    async get(req, res) {
        try {
            const customer = await Customers.find()
            existsOrError(customer, error.CANT_FIND_CUSTOMER)
            res.status(200).send(customer)
        }
        catch (msg) {
            return res.status(400).send(msg)
        }
    },

    async getOne(req, res) {
        const id = req.query

        try {
            const customer = await Customers.findOne(id)
            existsOrError(customer, `${error.CANT_FIND_CUSTOMER} pela id: ${id}`)
            res.status(200).send(customer)
        }
        catch (msg) {
            return res.status(400).send(msg)
        }
    },

    async create(req, res) {
        let customer
        let user = req.body
        const { id } = req.params
        const encryptPassword = password => {
            const salt = bcrypt.genSaltSync(10)
            return hash = bcrypt.hashSync(password, salt)
        }

        try {
            existsOrError(user.userPassword, error.NO_PASSWORD)

            if (!id) { //Pre-check for user signup
                existsOrError(user.userLoginName, error.NO_USERNAME)
                existsOrError(user.userRealName, error.NO_REALNAME)
                existsOrError(user.userConfirmPassword, error.NO_CONFIRM_PASSWORD)
                existsOrError(user.userEmailAddress, error.NO_EMAIL)
            }

            else { //User info update
                maxMinEqualsLength('equals', ID_LENGTH_DB, id, error.LENGTH_ID)
                customer = await Customers.findOne({ _id: id })
                existsOrError(customer, `${error.CANT_FIND_CUSTOMER} pela id: ${id}`)
            }

            if (exists(user.userLoginName)) {
                hasValidAscii(user.userLoginName, error.INVALID_ASCII)
                user.userLoginName = user.userLoginName.toLowerCase().trim()
                maxMinEqualsLength('min', 5, user.userLoginName, error.MIN_CHAR_USER)
                maxMinEqualsLength('max', 30, user.userLoginName, error.MAX_CHAR_USER)
                const customerLogin = await Customers.findOne({ userLoginName: user.userLoginName })
                notExistsOrError(customerLogin, error.EXISTING_USER)
            }

            if (exists(user.userRealName)) {
                maxMinEqualsLength('max', 60, user.userRealName, error.MAX_CHAR_NAME)
            }

            if (exists(user.userEmailAddress)) {
                user.userEmailAddress = user.userEmailAddress.toLowerCase().trim()
                verifyEmail(user.userEmailAddress, error.INVALID_EMAIL)
                const customerEmail = await Customers.findOne({ userEmailAddress: user.userEmailAddress })
                notExistsOrError(customerEmail, error.EXISTING_EMAIL)
            }

            if (!id) { //Create user on DB
                equalsOrError(user.userPassword, user.userConfirmPassword, error.MISMATCH_PASSWORD)
                securedPassword(3, user.userPassword, error.NOT_SECURE_PASSWORD)
                user.userPassword = encryptPassword(user.userPassword)
                delete user.userConfirmPassword

                customer = await Customers.create({
                    userLoginName: user.userLoginName,
                    userRealName: user.userRealName,
                    userPassword: user.userPassword,
                    userEmailAddress: user.userEmailAddress
                })
            }

            if (exists(user.userNewPassword)) {
                existsOrError(userConfirmPassword, error.NO_CONFIRM_PASSWORD)
                equalsOrError(user.userNewPassword, userConfirmPassword, error.MISMATCH_PASSWORD)
                securedPassword(3, user.userNewPassword, error.NOT_SECURE_PASSWORD)
                user.userPassword = encryptPassword(user.userNewPassword)
                delete user.userNewPassword,
                    delete user.userConfirmPassword
            }

            if (exists(user.userWhatsAppUrl)) {
                maxMinEqualsLength('max', 15, user.userWhatsAppUrl, error.MAX_CHAR_WHATSAPP)
            }

            if (id && user.userNewPassword) {
                if (bcrypt.compareSync(user.userPassword, customer.userPassword)) {
                    user = cleanUndefNull(user)
                    customer = await Customers.findOneAndUpdate({ _id: id }, user, { new: true, omitUndefined: true })
                }
                else
                    throw error.WRONG_PASSWORD
            }

            if (id) {
                if (bcrypt.compareSync(user.userPassword, customer.userPassword)) {
                    delete user.userPassword
                    user = cleanUndefNull(user)
                    customer = await Customers.findOneAndUpdate({ _id: id }, user, { new: true, omitUndefined: true })
                }
                else
                    throw error.WRONG_PASSWORD
            }

            res.status(200).send(customer)
        }
        catch (msg) {
            return res.status(400).send(msg)
        }
    },

    async remove(req, res) {
        const { id } = req.params
        let { userPassword } = req.body
        let customer

        try {
            maxMinEqualsLength('equals', ID_LENGTH_DB, id, error.LENGTH_ID)
            customer = await Customers.findOne({ _id: id }) //Get customer to verify password
            existsOrError(customer, `${error.CANT_FIND_CUSTOMER} pela id: ${id}`)
            existsOrError(userPassword, error.NO_PASSWORD)
            if (bcrypt.compareSync(userPassword, customer.userPassword)) {
                customer = await Customers.findOneAndRemove({ _id: id })
                res.status(200).send('Usuário deletado com sucesso')
            }
            else
                throw error.LOGIN_FAILED
        }
        catch (msg) {
            return res.status(400).send(msg)
        }
    },

    async photo(req, res) {
        const { id } = req.params
        try {

            const imgBase64 = await prepImg(req.file.path, 200, error.UPLOAD_IMG_FAILED) //prepImg to make file ready to be inserted into DB
            maxMinEqualsLength('equals', ID_LENGTH_DB, id, error.LENGTH_ID)
            const customer = await Customers.findOneAndUpdate({ _id: id }, { userProfilePicture: imgBase64 }, { new: true })
            existsOrError(customer, `${error.CANT_FIND_CUSTOMER} pela id: ${id}`)
            res.status(200).send(customer)
        }
        catch (msg) {
            return res.status(400).send(msg)
        }
    }
}

//const apiResponse = await axios.get('API DO GOOGLE')