import db from '../database/prismaConfig.js';
import { io } from '../../server.js';

export const sendMessage = async (req, res) => {
  try {
    const loggedIn = req.user;
    const { payload, toId = null, groupId = null } = req.body;
    console.log(req.body);
    if (!payload || !loggedIn) {
      return res.status(400).json({ message: "payload and fromId are required." });
    }
    if (!toId && !groupId) {
      return res.status(400).json({ message: "Either toId or groupId must be provided." });
    }

    const sender = await db.user.findFirst({ where: { email: loggedIn }, select: { id: true, name: true } });
    console.log("Sender:", sender);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found." });
    }

    if (toId) {
      const recipient = await db.user.findUnique({ where: { id: toId } });
      if (!recipient) return res.status(404).json({ message: "Recipient not found." });
    }

    if (groupId) {
      const group = await db.group.findUnique({ where: { id: groupId } });
      if (!group) return res.status(404).json({ message: "Group not found." });
    }

    const message = await db.message.create({
      data: {
        payload,
        fromId: sender.id,
        toId,
        groupId,
      },
      include: {
        from: {
          select: { id: true, name: true }
        }
      }
    });

    console.log("Message created:", message);
    // 🔥 Emit to socket
    if (toId) {
      // 1-to-1 chat
      io.to(toId.toString()).emit('receive_message', message);
    } else if (groupId) {
      // Broadcast to group
      io.to(`group_${groupId}`).emit('receive_message', message);
    }

    return res.status(201).json(message);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


export const getMessageOfUser = async (req, res) => {
  try {
    const loggedIn = req.user;
    const toId =String(req.params.id).trim(); 
    if (!toId || !loggedIn) {
      return res.status(400).json({ message: "fromId and logged in user are required." });
    }

    const sender = await db.user.findFirst({
      where: { email: loggedIn },
      select: { id: true, name: true }
    });

    if (!sender) {
      return res.status(404).json({ message: "Sender not found." });
    }

const all = await db.message.findMany({
  orderBy: { createdAt: 'asc' }
});
    const messages = await db.message.findMany({
      where: {
        OR: [
          { fromId: sender.id, toId: toId },
          { fromId: toId, toId: sender.id }
        ]
      },
      orderBy: { createdAt: 'asc' },
      include: {
        from: { select: { id: true, name: true, avatar: true } },
        to: { select: { id: true, name: true, avatar: true } }
      }
    });
    return res.status(200).json(messages);

  } catch (error) {
    console.error("Error in getMessageOfUser:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
