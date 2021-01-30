const mongoose = require('mongoose')

const CustomersSchema = new mongoose.Schema({
    userLoginName: {
        type: String,
        require: true,
        unique: true,
        minlength: 5,
        maxlength: 30,
        lowercase: true
    },
    userRealName: {
        type: String,
        require: true,
        maxlength: 60
    },
    userPassword: {
        type: String,
        require: true,
        select: false,
        maxlength: 60,
        minlength: 8
    },
    userState: { //Veriricar se sera necessario para o back-end
        type: Boolean
    },
    userEmailAddress: {
        type: String,
        require: true,
        lowercase: true,
        unique: true
    },
    userWhatsAppUrl: {
        type: String,
        unique: true,
        minlength: 11
    },
    userInstagramUrl: String,
    userFacebookUrl: String
})

module.exports = mongoose.model('Customers', CustomersSchema)