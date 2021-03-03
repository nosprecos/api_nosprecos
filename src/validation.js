const passwordValidator = require('password-validator')

/**
 * Check if a variable holds a null/undef value a throw a message
 * @param {AnyType} value 
 * @param {String} msg 
 */

function existsOrError(value, msg){
    if(!value) throw msg
    if(Array.isArray(value) && value.lenght === 0) throw msg
    if(typeof value === 'string' && !value.trim()) throw msg
}

/**
 * Check if a variable holds a null and throw a message
 * @param {AnyType} value 
 * @param {String} msg 
 */

function notExistsOrError(value, msg){
    try {
        existsOrError(value, msg)
    } catch(msg) {
        return
    }
    throw msg
}

/**
 * Returns a boolean indicating if a value holds a null/undef
 * @param {String} value 
 * @param {Array} value
 * @param {Char} value
 */

function exists(value){
    if(!value && value !== "") return false
    else if(Array.isArray(value) && value.lenght === 0) return true
    else if(typeof value === 'string' && !value.trim()) return true
    else return true
}

/**
 * Interate an object eliminating any null/undef property
 * @param {Object} obj 
 */

function cleanUndefNull(obj){
    for (let prop in obj){
        if(obj[prop] === null || obj[prop] === undefined){
            delete obj[prop]
        }
    }
    return obj
}

/**
 * Check if a string has an ascii value within a certain range
 * and throw a msg in case of contrary.
 * @param {String} str 
 * @param {String} msg 
 */

function hasValidAscii(str, msg){
    for (let i=0; i<str.length; i++){
        if(str.charCodeAt(i) < 32 || str.charCodeAt(i) > 126){
            throw msg
        }
    return
    }
}

/**
 * Check if two variables are equals
 * @param {AnyType} valueA 
 * @param {AnyType} valueB 
 * @param {String} msg 
 */

function equalsOrError(valueA, valueB, msg){
    if(valueA !== valueB) throw msg
}

/**
 * Check if a value meets a target condition (type) passed
 * @param {String} type 
 * @param {Integer} target 
 * @param {String} value 
 * @param {String} msg 
 */

function maxMinEqualsLength (type, target, value, msg){
    if(type === 'max' || type === 'MAX'){
        if(value.length > target) throw msg
    }
    if(type === 'min' || type === 'MIN'){
        if(value.length < target) throw msg
    }
    if(type === 'equals' || type === 'EQUALS'){
        if(value.length != target) throw msg
    }
}

/**
 * securityLevel:
    (0) or null Minimum 8 and Maximum 60 characters
    (1) Level 0 + an uppercase letter and a lowercase letter
    (2) Level 1 + a number
    (3) Level 2 + a special character such as ('!', '@', '#', '$', '%', '&', '*')
 * @param {Integer} securityLevel 
 * @param {AnyType} value 
 * @param {String} msg 
 */

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

/**
 * Regex check for email validation
 * @param {String} value 
 * @param {String} msg 
 */

function verifyEmail(value, msg){
    if(!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        .test(value))){
        throw msg
    }
}

module.exports = {existsOrError, exists, notExistsOrError, cleanUndefNull, 
    equalsOrError, maxMinEqualsLength, securedPassword, verifyEmail, hasValidAscii}