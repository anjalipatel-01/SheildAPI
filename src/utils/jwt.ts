import jwt from "jsonwebtoken";
import { AppError } from "./AppError.js";

export const signtoken = (payload: object): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string) => {
  if (!token) {
    throw new AppError("Access Denied, No token provided", 401);
  }
  return jwt.verify(token, process.env.JWT_SECRET!);
};