import express from 'express';
import userAuth from '../middlewares/authmiddleware.js';
import { deletejobcontroller, getalljobcontroller, jobcontroller, updatejobcontroller } from '../controllers/jobcontroller.js';

const router = express.Router();

//routes
//-----create job,post method-----------
router.post('/create-job', userAuth, jobcontroller);

//--------------get jobs---------------
router.get('/all-jobs', userAuth, getalljobcontroller)


//----------patch//update jobs----------
router.patch('/update-job', userAuth, updatejobcontroller)

//----------delete//delete jobs----------
router.delete('/delete-job/:id', userAuth, deletejobcontroller)

export default router;