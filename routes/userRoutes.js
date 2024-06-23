import express from 'express';
import userAuth from '../middlewares/authmiddleware.js';
import { updateusercontroller } from '../controllers/usercontroller.js';

//router object
const router = express.Router()

//routes
//get
//update user using put
router.put('/update-user/:id', userAuth, updateusercontroller);

export default router;