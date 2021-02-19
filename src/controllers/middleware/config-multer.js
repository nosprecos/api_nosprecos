const multer = require('multer')
const path = require('path')

const imgUpload = multer({
    storage: multer.diskStorage({

        destination: (req, file, cb) =>{
            cb(null, path.resolve("tmp", "uploads"))
        },
        /*
        filename: (req, file, cb) =>{
            const {id} = req.params
            cb(null, `${id}-profilepicture${path.extname(file.originalname)}`)
        }*/
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
        } else cb(new Error('Tipo de arquivo de foto nao permitido'))
    },

})

module.exports = {imgUpload}
