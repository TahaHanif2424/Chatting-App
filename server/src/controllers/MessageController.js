import db from '../database/prismaConfig.js';

export const sendMessage = async (req, res) => {
  try {
    const { payload, fromId, toId = null, groupId = null } = req.body;

    if (!payload || !fromId) {
      return res.status(400).json({ message: "payload and fromId are required." });
    }
    if (!toId && !groupId) {
      return res.status(400).json({ message: "Either toId (for a direct message) or groupId (for a group message) must be provided." });
    }
    const sender = await db.user.findUnique({ where: { id: fromId } });
    if (!sender) {
      return res.status(404).json({ message: "Sender not found." });
    }
    if (toId) {
      const recipient = await db.user.findUnique({ where: { id: toId } });
      if (!recipient) {
        return res.status(404).json({ message: "Recipient user not found." });
      }
    }
    if (groupId) {
      const group = await db.group.findUnique({ where: { id: groupId } });
      if (!group) {
        return res.status(404).json({ message: "Group not found." });
      }
    }

    const message = await db.message.create({
      data: {
        payload,
        fromId,
        toId,
        groupId,
      },
    });

    return res.status(201).json(message);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
