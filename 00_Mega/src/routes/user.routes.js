import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from '../middlewares/multer.middleware.js'
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



export default router