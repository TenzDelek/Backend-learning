import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router=Router()
router.route('/register').post(registerUser)
// now the url will look like api/v1/user/register #the api/v1 is consider as standard to write such

export default router