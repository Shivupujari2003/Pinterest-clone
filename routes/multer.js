const multer=require('multer');
const {v4:uuidv4}=require('uuid');
const path=require('path')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads')       //destination folder for uploads
    },
    filename: function (req, file, cb) {
      const uniqueFilename = uuidv4();    //generating unique filename using uuid
      cb(null,uniqueFilename+path.extname(file.originalname) );
    }
  })
  
  const upload = multer({ storage: storage })
  module.exports=upload;    