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
    const { userId, groupId } = req.body;

    if (!userId || !groupId) {
      return res
        .status(400)
        .json({ message: "Both userId and groupId are required." });
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const group = await db.group.findUnique({ where: { id: groupId } });
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    const existing = await db.groupMember.findUnique({
      where: { userId_groupId: { userId, groupId } }
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "You are already a member of this group." });
    }

    const groupMember = await db.groupMember.create({
      data: { userId, groupId }
    });

    return res.status(201).json({
      message: "Group joined successfully.",
      groupMember
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