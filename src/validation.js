module.exports = {

    existsOrError(value, msg){
        if(!value) throw response.json(msg)
        if(Array.isArray(value) && value.lenght === 0) throw msg
        if(typeof value === 'string' && !value()) throw msg
    },

    notExistsOrError(value, msg){
        try {
            existsOrError(value, msg)
        } catch(msg) {
            return
        }
        throw msg
    },

    equalsOrError(valueA, valueB, msg){
        if(value !== valueB) throw msg
    },

}