const mongoose = require('mongoose')

const CustomersSchema = new mongoose.Schema({
    userLoginName: String,
    userRealName: String,
    userPassword: String,
    userState: Boolean, //Veriricar se sera necessario para o back-end
    userEmailAddress: String,
    userWhatsAppUrl: String,
    userInstagramUrl: String,
    userFacebookUrl: String
})

module.exports = mongoose.model('Customers', CustomersSchema)