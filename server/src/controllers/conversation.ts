require("dotenv").config();
import db from "../models";

import { RequestExtended, ResponseExtended } from "../types";
import { Op } from "sequelize";
const { conversations, users } = db;

// create new conversation
export const createConversation = async (
  req: RequestExtended,
  res: ResponseExtended
) => {
  try {
    const { senderId, receiverId } = req.body;
    const conversationsData = await conversations.findAll({
      where: { members: { [Op.contains]: [`${senderId}`, `${receiverId}`] } },
    });
    if (conversationsData[0]) {
      return res.status(500).json({
        message: "Coversation already exists!",
        status: 500,
      });
    }
    const conversation = await conversations.create({
      members: [senderId, receiverId],
    });
    return res.status(200).json({
      message: "success",
      status: 200,
      conversation,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//get conversations of a user
export const getConversationsByUserId = async (
  req: RequestExtended,
  res: ResponseExtended
) => {
  try {
    const { userId } = req.params;
    const conversationsData = await conversations.findAll({
      where: { members: { [Op.contains]: [`${userId}`] } },
    });
    return res.status(200).json({
      message: "success",
      status: 200,
      conversations: conversationsData,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// get a conversation includes two userId
export const getConversationsBy2Users = async (
  req: RequestExtended,
  res: ResponseExtended
) => {
  try {
    const { firstUserId, secondUserId } = req.params;
    const conversationsData = await conversations.findAll({
      where: {
        members: { [Op.contains]: [`${firstUserId}`, `${secondUserId}`] },
      },
    });
    return res.status(200).json({
      message: "success",
      status: 200,
      conversation: conversationsData[0],
    });
  } catch (err) {
    return res.status(500).json({ status: 500, error: err.message });
  }
};
