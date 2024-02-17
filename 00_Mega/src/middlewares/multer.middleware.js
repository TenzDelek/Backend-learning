import multer from "multer"
//there are many choise// disk or memory being the popular one
//we are using disk storage
//taken from docucmentation
const storage = multer.diskStorage({
    //cb is callback
    //the reason for using multer is we have a another option call file 
    //which express cant handle so multer is used to handle it
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  export const upload = multer({ storage })