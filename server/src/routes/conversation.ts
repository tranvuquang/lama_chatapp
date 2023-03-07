import express from "express";
import { validateToken } from "../middlewares/auth";
import {
  createConversation,
  getConversationsBy2Users,
  getConversationsByUserId,
} from "../controllers/conversation";

const router = express.Router();

router.post("/create", validateToken, createConversation);

router.get("/:userId", validateToken, getConversationsByUserId);

router.get(
  "/:firstUserId/:secondUserId",
  validateToken,
  getConversationsBy2Users
);

export default router;
