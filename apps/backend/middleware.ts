import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

declare module "express" {
  interface Request {
    userId?: string;
  }
}

export const middleware = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, "secret") as { id: string };
    req.userId = decoded.id;
    next();
  } catch (e) {
    res.status(401).json({ message: "Invalid token" });
  }
};
