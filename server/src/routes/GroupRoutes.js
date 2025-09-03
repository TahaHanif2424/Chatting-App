import express from 'express';
import { createGroup, joinGroup , getUserGroups , getGroupMessages, searchUser, getMembersByGroupId, leaveGroup} from '../controllers/GroupController.js';
const router=express.Router();


// http://localhost:5000/api/user/chats
router.post("/",createGroup);
router.post("/join",joinGroup);
router.get("/",getUserGroups);
router.get("/messages/:groupId",getGroupMessages);
router.get("/addUser",searchUser);
router.get("/members",getMembersByGroupId);
router.delete("/leave",leaveGroup);

export default router;