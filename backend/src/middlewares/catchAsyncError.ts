import type { NextFunction, Request, Response } from "express";

const catchAsyncError =
  (func: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch(next);
  };

export default catchAsyncError;
