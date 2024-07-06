import express from 'express';
import userAuth from '../middlewares/authmiddleware.js';
import { getUserDataController, updateusercontroller } from '../controllers/usercontroller.js';

//router object
const router = express.Router()

//get user data||post
router.post('/getUser', userAuth, getUserDataController);


//routes
//get
//update user using put
router.put('/update-user', userAuth, updateusercontroller);

export default router;