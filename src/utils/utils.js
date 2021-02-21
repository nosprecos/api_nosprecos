const sharp = require('sharp')

function prepImg(image, target, msg){
    
    return sharp(image)
    .rotate()
    .resize({width: target})
    .toBuffer()
    .then((data) =>{
        return (`data:image/jpeg;base64,${new Buffer.from(data).toString('base64')}`)
    })
    .catch(() =>{
        throw msg
    })
}

module.exports = {prepImg}