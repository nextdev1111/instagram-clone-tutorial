import type { Request, NextFunction, Response } from "express";
import { authMiddlewareOptions, user } from "../typing";
import ServerError from "../utils/serverError";
import catchAsyncError from "./catchAsyncError";
import jwt from "jsonwebtoken";
import { userModel } from "../models";

const authVerify = (
  options: authMiddlewareOptions = { allowNonVerifiedEmail: true }
) => {
  return catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      // fetch token from headers
      const token = req.headers.token;

      //   checking if token is available in the headers
      if (typeof token !== "string") {
        return next(
          new ServerError("Please login to perform this action", 401)
        );
      }

      // decoding the jwt token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);

      const userId = (decodedToken as any).id;

      const user = await userModel.findById(userId);

      if (!user) {
        next(new ServerError("User not found with this token", 404));
      }

      //   checking if the email is verified or not
      if (
        user?.isEmailVerified === false &&
        options.allowNonVerifiedEmail === false
      ) {
        next(new ServerError("Email is not verified.", 401));
      }

      //   manipulating the req
      req.user = user as user;

      next();
    }
  );
};

export default authVerify;
