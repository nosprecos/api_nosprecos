const multer = require('multer')
const path = require('path')

const imgUpload = {
    storage: multer.diskStorage({

        destination: (req, file, cb) =>{
            cb(null, path.resolve("tmp", "uploads"))
        }
    }),

    limits: {
        //fileSize: 
    },
    
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/jpg',
            'image/png'
        ]

        if(allowedMimes.includes(file.mimetype)){
            cb(null, true)
        } else cb(new multer.MulterError (null, 'Tipo de arquivo de foto nao permitido'))
    },

}

module.exports = {imgUpload, multer}
