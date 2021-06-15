const multer = require('multer');


const filter = (req, file, cb) => {
    if (file.mimetype.includes('csv') || file.mimetype.includes('xlsx')) {
        cb(null, true);
    } else {
        cb("Please upload a valid file", false)
    }
}

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/uploads")
    },
    filename: (req, file, cb) => {
        console.log(file.originalname);
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const uploadFiles = multer({ storage: storage, fileFilter: filter })

module.exports = uploadFiles;