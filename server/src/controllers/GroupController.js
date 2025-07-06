import { use } from 'react';
import db from '../database/prismaConfig.js';

export const createGroup = async (req, res) => {
    try {
        const { name, adminId } = req.body;
        if (!adminId || !name) {
            return res.status(400).send({ message: "Admin or Name are require" });
        }
        const user = await db.user.findUnique({ where: { id: adminId } });
        if (!user) {
            return res.status(400).send({ message: "Admin not found..." });
        }
        const [group] = await db.$transaction([
            db.group.create({
                data: {
                    name,
                    members: {
                        create: { userId: adminId }
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