import * as jwt from "jsonwebtoken";
import { error } from "node:console";
export const signtoken = (payload: object): string => {

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string) => {
  if (!token) {
    throw new Error("Access Denied,No token provided");
  }
  return jwt.verify(token, process.env.JWT_SECRET!)
};