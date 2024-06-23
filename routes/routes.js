import express from "express";
import { testpostcontroller } from "../controllers/testController.js"
import { logincontroller } from "../controllers/authcontroller.js";
import userAuth from "../middlewares/authmiddleware.js";
//router object
const router = express.Router();

//routes
//register route
router.post('/test-post', testpostcontroller)


export default router