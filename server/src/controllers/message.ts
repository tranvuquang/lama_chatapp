require("dotenv").config();
import db from "../models";

import { RequestExtended, ResponseExtended } from "../types";
// import { Op } from "sequelize";
const { messages } = db;

// create new message
export const createMessage = async (
  req: RequestExtended,
  res: ResponseExtended
) => {
  try {
    const { sender, text, conversationId } = req.body;
    const message = await messages.create({
      sender,
      text,
      conversationId,
    });
    return res.status(200).json({
      message,
      status: 200,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getMessagesByConversationId = async (
  req: RequestExtended,
  res: ResponseExtended
) => {
  try {
    const { id } = req.params;
    const messagesData = await messages.findAll({
      where: {
        conversationId: id,
      },
    });

    return res.status(200).json({
      message: "success",
      status: 200,
      messages: messagesData,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
