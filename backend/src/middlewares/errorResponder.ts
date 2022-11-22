import type { NextFunction, Request, Response } from "express";
import ServerError from "../utils/serverError";

const errorResponder = (
  error: ServerError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // preventing any undefined value to be given to errorHandler
  error = new ServerError(
    error.message || "Internal Server Error",
    error.statusCode || 500
  );

  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};

export default errorResponder;
