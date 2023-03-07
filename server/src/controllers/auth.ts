require("dotenv").config();
import db from "../models";

import { RequestExtended, ResponseExtended } from "../types";
import jwt from "jsonwebtoken";
import { QueryTypes } from "sequelize";
const { users } = db;

export const register = async (req: RequestExtended, res: ResponseExtended) => {
  try {
    const { email, password } = req.body;
    const user = await users.findOne({ where: { email } });
    if (user) {
      return res.status(500).json({
        message: "User already exists!",
        status: 500,
      });
    }
    const userData = await users.create({
      email,
      password,
    });
    return res.status(200).json({
      message: "success",
      status: 200,
      user: {
        id: userData.id,
        email,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const login = async (req: RequestExtended, res: ResponseExtended) => {
  try {
    const { email, password } = req.body;
    const user = await users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found!" });
    }
    if (password !== user.password) {
      return res.status(400).json({
        message: "Wrong username or password!",
        status: 400,
      });
    }
    const userData = {
      id: user.id,
      email,
    };
    const accessToken = jwt.sign(userData, process.env.JWT as string);
    return res.status(200).json({
      message: "success",
      status: 200,
      user: userData,
      accessToken,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (
  req: RequestExtended,
  res: ResponseExtended
) => {
  try {
    const { id } = req.params;
    const [user] = await db.sequelize.query(
      "SELECT * FROM users WHERE id = ?",
      {
        replacements: [id],
        type: QueryTypes.SELECT,
      }
    );
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found!" });
    }
    return res.status(200).json({
      message: "success",
      status: 200,
      user: {
        email: user.email,
        id,
      },
    });
  } catch (err) {
    return res.status(500).json({ status: 500, error: err.message });
  }
};
