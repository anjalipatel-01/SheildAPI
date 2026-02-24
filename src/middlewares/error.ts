import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Handle Prisma-specific errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        const field = (err.meta?.target as string[])?.join(", ") || "field";
        return res.status(409).json({
          status: "fail",
          message: `A record with that ${field} already exists.`,
        });
      }
      case "P2025":
        return res.status(404).json({
          status: "fail",
          message: "Record not found.",
        });
      case "P2003":
        return res.status(400).json({
          status: "fail",
          message: "Related record not found. Check your reference IDs.",
        });
    }
  }

  // Handle validation errors from Prisma
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid data provided.",
    });
  }

  // Default: operational AppError or unknown 500
  const statusCode = err.statusCode || 500;
  const isOperational = !!err.statusCode;

  if (process.env.NODE_ENV === "development") {
    // Development: send full error details for debugging
    return res.status(statusCode).json({
      status: "error",
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }

  // Production: hide internal details
  console.error(err);
  res.status(statusCode).json({
    status: "error",
    message: isOperational ? err.message : "Something went wrong.",
  });
};
