import express from 'express';
import { addUser, getAllChats, getAvatar, loginUser } from '../controllers/UserController.js';
const router=express.Router();


// http://localhost:5000/api/user/chats
router.get("/chats",getAllChats);


export default router;