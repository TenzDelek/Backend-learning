import multer from "multer"
//there are many choice// disk or memory being the popular one
//we are using disk storage
//taken from documentation
const storage = multer.diskStorage({
    //cb is callback
    //the reason for using multer is we have a another prop call file 
    //which express cant handle so multer is used to handle it

    //here we declare the destination and the filename
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  export const upload = multer({ storage })