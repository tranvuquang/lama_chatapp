import express from "express";
import { createMessage, getMessagesByConversationId } from "../controllers/message";
import { validateToken } from "../middlewares/auth";

const router = express.Router();

router.post("/create", validateToken, createMessage);

router.get("/:id", validateToken, getMessagesByConversationId);

export default router;
