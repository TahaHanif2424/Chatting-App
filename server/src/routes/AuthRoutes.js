import express from 'express';
import { addUser, getAllChats, getAvatar, loginUser } from '../controllers/UserController.js';
const router=express.Router();


// http://localhost:5000/api/auth/signup
router.post("/signup",addUser);
// http://localhost:5000/api/auth/login
router.post("/login",loginUser);
// http://localhost:5000/api/auth/avatar
router.get("/avatar",getAvatar);

export default router;