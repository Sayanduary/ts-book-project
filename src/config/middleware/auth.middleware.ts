import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { IResponse } from "../../controller/book_controller";

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access Denied",
      } as IResponse);
      return;
    }

    const secret = process.env.JWT_SECRET_KEY;

    if (!secret) {
      res.status(500).json({
        success: false,
        message: "JWT secret is not configured",
      } as IResponse);
      return;
    }

    const data = jwt.verify(token, secret) as {
      id: string;
      role: string;
    };

    req.id = data.id;
    req.role = data.role;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      } as IResponse);
      return;
    }
    next(error);
  }
};
