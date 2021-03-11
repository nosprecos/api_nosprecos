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

    userProfilePicture: {
        type: String,
    },

    userPassword: {
        type: String,
        require: true,
        maxlength: 60,
        minlength: 8
    },
    userEmailAddress: {
        type: String,
        require: true,
        lowercase: true,
        unique: true
    },
    userWhatsAppUrl: {
        type: String,
        minlength: 15
    },
    userInstagramUrl: String,
    userFacebookUrl: String
})

module.exports = mongoose.model('Customers', CustomersSchema)