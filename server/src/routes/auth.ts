import express from "express";
import { validateToken } from "../middlewares/auth";
import { getUserById, login, register } from "../controllers/auth";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/:id", validateToken, getUserById);

export default router;
