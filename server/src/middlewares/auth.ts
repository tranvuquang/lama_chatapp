import { verify } from "jsonwebtoken";
import {
  RequestExtended,
  ResponseExtended,
  NextFunctionExtended,
} from "../types";

export const validateToken = (
  req: RequestExtended,
  res: ResponseExtended,
  next: NextFunctionExtended
) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(403).send("Access Denied");
    }
    const decoded = verify(token, process.env.JWT as string) as any;
    req.headers.user = decoded;
    if (!decoded) {
      return res.status(403).send("Token is not valid!");
    }
    return next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { validateToken };
