import db from '../database/prismaConfig.js';

export const createGroup = async (req, res) => {
    try {
      const loggedIn =req.user;
      const adminId = await db.user.findUnique({
        where:{
          email:loggedIn
        },
        select:{
          id: true,
        }
      })
        const { name } = req.body;
        if (!adminId.id || !name) {
            return res.status(400).send({ message: "Admin or Name are require" });
        }
        const user = await db.user.findUnique({ where: { id: adminId.id } });
        if (!user) {
            return res.status(400).send({ message: "Admin not found..." });
        }
        const [group] = await db.$transaction([
            db.group.create({
                data: {
                    name,
                    adminId: adminId.id,
                    members: {
                        create: { userId: adminId.id }
                    }
                }
            })
        ]);
        return res.status(201).json({
            message: "Group created successfully",
            group
        });
    } catch (error) {
        console.error("Error in sendMessage:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}
export const joinGroup = async (req, res) => {
  try {
    const { userIds, groupId } = req.body; // 👈 changed to userIds (array)

    if (!Array.isArray(userIds) || userIds.length === 0 || !groupId) {
      return res
        .status(400)
        .json({ message: "userIds (array) and groupId are required." });
    }

    // ✅ Validate group
    const group = await db.group.findUnique({ where: { id: groupId } });
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    // ✅ Validate users exist
    const users = await db.user.findMany({
      where: { id: { in: userIds } }
    });

    if (users.length !== userIds.length) {
      return res.status(404).json({ message: "Some users not found." });
    }

    // ✅ Check existing memberships
    const existingMembers = await db.groupMember.findMany({
      where: {
        userId: { in: userIds },
        groupId
      }
    });

    const existingUserIds = existingMembers.map(m => m.userId);

    // ✅ Filter only new users
    const newUserIds = userIds.filter(id => !existingUserIds.includes(id));

    if (newUserIds.length === 0) {
      return res
        .status(409)
        .json({ message: "All users are already members of this group." });
    }

    // ✅ Add new members
    const createdMembers = await db.groupMember.createMany({
      data: newUserIds.map(userId => ({ userId, groupId })),
      skipDuplicates: true, // safety
    });
    return res.status(201).json({
      message: "Users added to group successfully.",
      addedCount: createdMembers.count,
      groupId,
      newUserIds
    });
  } catch (error) {
    console.error("Error in joinGroup:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


export const getUserGroups = async (req, res) => {
  try {
    const loggedIn =req.user;
    const userId = await db.user.findUnique({
      where:{
        email:loggedIn
      },
      select:{
        id: true,
      }
    })
      if (!userId.id) {
          return res.status(400).send({ message: "User Id is require" });
      }
      const user = await db.user.findUnique({ where: { id: userId.id } });
      if (!user) {
          return res.status(400).send({ message: "User not found..." });
      }
      const groups = await db.groupMember.findMany({
        where: { userId: userId.id },
        include: { group: true }
      });
      return res.status(200).json({
          message: "User groups fetched successfully",
          groups
      });
  } catch (error) {
      console.error("Error in getUserGroups:", error);
      return res.status(500).json({ message: "Internal server error." });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!groupId) {
      return res.status(400).json({ message: "Group ID is required." });
    }

    const group = await db.group.findUnique({ where: { id: groupId } });
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    const messages = await db.message.findMany({
      where: { groupId },
      orderBy: { createdAt: 'asc' },
      include: {
        from: { select: { id: true, name: true, avatar: true } }
      }
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getGroupMessages:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export const searchUser=async (req,res)=>{
  try {
    const loggedIn =req.user;
    const currentUser = await db.user.findUnique({
      where:{
        email:loggedIn
      },
      select:{
        id: true,
        email:true
      }
    });
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Name is required." });
    }
    const users = await db.user.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
        NOT: { id: currentUser.id }
      },
      select: { id: true, name: true, email: true, avatar: true }
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error in searchUser:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export const getMembersByGroupId = async (req,res) => {
  try {
    const { groupId } = req.query;
    if (!groupId) {
      return res.status(400).json({ message: "Group ID is required." });
    }
    const members = await db.groupMember.findMany({
      where: { groupId },
      include: {
        user: { select: { id: true, name: true, avatar: true } }
      }
    });
    return res.status(200).json(members);
  } catch (error) {
    console.error("Error in getMembersByGroupId:", error);
    return res.status(500).json({ message: "Internal server error." });
  } 
}

export const leaveGroup= async(req,res)=>{
  try{
    const loggedIn=req.user;
    const {groupId}= req.query;
    console.log(loggedIn, groupId);
    // Get user ID from email
    const user = await db.user.findUnique({
      where: {
        email: loggedIn
      },
      select: {
        id: true
      }
    });
    
    if (!user || !groupId) {
      return res.status(400).json({ message: "User and Group ID are required." });
    }

    // Check if user is a member of the group
    const membership = await db.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: user.id,
          groupId: groupId
        }
      }
    });
    console.log(membership);
    if (!membership) {
      return res.status(404).json({ message: "User is not a member of this group." });
    }

    // Remove user from group
    await db.groupMember.delete({
      where: {
        userId_groupId: {
          userId: user.id,
          groupId: groupId
        }
      }
    });

    return res.status(200).json({ 
      message: "Successfully left the group.",
      userId: user.id,
      groupId 
    });
  } catch (error) {
    console.error("Error in leaveGroup:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}