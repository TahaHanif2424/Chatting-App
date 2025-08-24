import express from 'express';
import { sendMessage, getMessageOfUser} from '../controllers/MessageController.js';
const router=express.Router();


// http://localhost:5000/api/message
router.get("/:id",getMessageOfUser);
// http://localhost:5000/api/message
router.post("/",sendMessage);

export default router;