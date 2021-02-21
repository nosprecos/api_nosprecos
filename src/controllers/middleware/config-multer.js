const multer = require('multer')
const path = require('path')
const maxSizeFile = 1 * 1024 * 1024 //5 mb

module.exports = {
    middlewareMulter (req, res, next){
        multer(config).single('picture')(req, res, function(err){
            //if (req.file.size > maxSizeFile) res.status(400).send('erro')
            if (err instanceof multer.MulterError) return res.status(400).send(err.field)
            else if(err) return res.status(400).send(err)
            next()
        })
    }
}

let config = {
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
        // else if (size > maxSizeFile){
        //     console.log(req.file.size)
        //     cb(new multer.MulterError(null, `Tamanho de arquivo ultrapassa ${maxSizeFile} bytes`))
        // }
        else cb(new multer.MulterError(null, 'Tipo de arquivo de foto nao permitido'))
    }
}
