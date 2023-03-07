import express from "express";
import { validateToken } from "../middlewares/auth";
import {
  getReceivers,
  getUserById,
  login,
  register,
} from "../controllers/auth";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/receivers", validateToken, getReceivers);

router.get("/:id", validateToken, getUserById);

export default router;
