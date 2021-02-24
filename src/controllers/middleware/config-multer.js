const multer = require('multer')
const path = require('path')
const maxSizeFile = 5 * 1024 * 1024 //5 mb

module.exports = {
    uploadImg (req, res, next){
        multer(config).single('picture')(req, res, function(err){
            if (err instanceof multer.MulterError){
                switch(err.code){
                    case 'LIMIT_FILE_SIZE':
                        return res.status(400).send(`Arquivo de foto ultrapassa ${maxSizeFile / Math.pow(1024, 2)} mb`)
                    case 'LIMIT_UNEXPECTED_FILE':
                        return res.status(400).send('Tipo de arquivo nao permitido')
                    default:
                        return res.status(400).send(err)
                }
            }
            else if (err){ 
                return res.status(400).send(err)
            }    
            else next()
        })
    }
}

const config = {
    storage: multer.diskStorage({
        destination: (req, file, cb) =>{
            cb(null, path.resolve("tmp", "uploads"))
        }
    }),
    limits:{
        fileSize: maxSizeFile
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/jpg',
            'image/png'
        ]
        if(allowedMimes.includes(file.mimetype)){
            cb(null, true)
        }
        else cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', null))
    }
}
