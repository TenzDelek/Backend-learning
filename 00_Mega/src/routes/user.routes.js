import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router()
router.route('/register').post(
    //middlware to use file
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),

    registerUser
    )
// now the url will look like api/v1/user/register #the api/v1 is consider as standard to write such

router.route("/login").post(loginUser)
//this says when route is /login the method that should run is the loginuser one


//secure route
router.route("/logout").post(verifyJWT, logoutUser) //HERE THE VERFITJWT 
//IS THE MIDDLWARE, FIRST IT DOES IT THEN LOGOUT IS DONE AS IN THE VERFIYJWT MIDDLEWARE
//REMEMBER WE WROTE NEXT(). YA THAT DOES IT LIKE SEND IT TO NEXT

export default router