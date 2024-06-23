import express from "express";
import { logincontroller, registercontroller } from "../controllers/authcontroller.js";
import userAuth from "../middlewares/authmiddleware.js";



//router object
const router = express.Router();


//routes
//1.register route
router.post('/register', registercontroller);
//2.login route
router.post('/login', logincontroller);

export default router;