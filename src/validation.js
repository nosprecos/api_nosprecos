const passwordValidator = require('password-validator')

function existsOrError(value, msg){
    if(!value) throw msg
    if(Array.isArray(value) && value.lenght === 0) throw msg
    if(typeof value === 'string' && !value.trim()) throw msg
}

function notExistsOrError(value, msg){
    try {
        existsOrError(value, msg)
    } catch(msg) {
        return
    }
    throw msg
}

function equalsOrError(valueA, valueB, msg){
    if(valueA !== valueB) throw msg
}

function maxMin (type, target, value, msg){
    if(type === 'max' || type === 'MAX'){
        if(value.length > target) throw msg
    }
    if(type === 'min' || type === 'MIN'){
        if(value.length < target) throw msg
    }
}

/**
    securityLevel:
    (0) or null Minimum 8 and Maximum 60 characters
    (1) Level 0 + an uppercase letter and a lowercase letter
    (2) Level 1 + a number
    (3) Level 2 + a special character such as ('!', '@', '#', '$', '%', '&', '*')
**/

function securedPassword (securityLevel, value, msg){
    let schema = new passwordValidator()
    
    schema.is().min(8).max(60)

    switch(securityLevel){
        case 0:
            if (!schema.validate(value)) throw msg
            break
        case 1:
            schema.has().uppercase(1).lowercase(1)
            if (!schema.validate(value)) throw msg
            break
        case 2:
            schema.has().uppercase(1).lowercase(1).digits(1)
            if (!schema.validate(value)) throw msg
            break
        case 3:
            schema.has().uppercase(1).lowercase(1).digits(1).symbols(1)
            if (!schema.validate(value)) throw msg
            break
        default:
            if (!schema.validate(value)) throw msg
    }
}

module.exports = {existsOrError, notExistsOrError, equalsOrError, maxMin, securedPassword}