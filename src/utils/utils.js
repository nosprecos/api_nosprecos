const sharp = require('sharp')

function prepImg(image, target, msg) {
    return sharp(image)
        .toFormat('jpeg')
        .rotate()
        .resize({ width: target })
        .toBuffer()
        .then((data) => {
            return (`data:image/jpeg;base64,${Buffer.from(data).toString('base64')}`)
        })
        .catch(() => {
            throw msg
        })
}

module.exports = { prepImg }