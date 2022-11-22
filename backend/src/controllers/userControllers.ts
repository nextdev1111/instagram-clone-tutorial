import { NextFunction } from "./../../node_modules/@types/express-serve-static-core/index.d";
import type { Request, Response } from "express";
import ServerError from "../utils/serverError";
import catchAsyncError from "../middlewares/catchAsyncError";
import { userModel } from "../models";
import sendEmail from "../utils/sendEmail";
import crypto from "crypto";

// Register a User by email
export const registerUser = catchAsyncError(
  async (req: Request, res: Response) => {
    // get information from the request
    const { email, password, name } = req.body;

    // register in database
    const user = await userModel.create({
      email,
      password,
      name,
    });

    // generating token
    const token = user.generateJWTToken();

    return res.status(201).json({
      success: true,
      user: {
        ...user._doc,
        token: token,
      },
    });
  }
);

// Login a user
export const loginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // get the information from the req
    const { email, password } = req.body;

    // checking if the user has entered email and password
    if (typeof email !== "string" || typeof password !== "string") {
      return next(new ServerError("Please enter your email and password", 400));
    }

    // Finding user in the database by it's email.
    const user = await userModel.findOne({ email });

    // checking if user exists
    if (!user) {
      return next(new ServerError("Invalid email or password", 401));
    }

    // checking if the entered password is right or not.
    const isPasswordMatched = user.comparePassword(password);

    // if password doesn't match then return an error
    if (!isPasswordMatched) {
      return next(new ServerError("Invalid email or password", 401));
    }

    // generate a token
    const token = user.generateJWTToken();

    return res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        token: token,
      },
    });
  }
);

// get details -- authVerfied: true
export const getUserDetails = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user!;

    return res.status(200).json({ success: true, user });
  }
);

// update details -- authVerfied: true
export const updateUserDetails = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // fetch the data from body
    const { name } = req.body;

    const user = await userModel.findByIdAndUpdate(
      req.user!._id,
      { name },
      {
        new: true,
        projection: { name: 1 },
      }
    );

    return res.status(200).json({ success: true, user });
  }
);

// email verification request -- authVerified: true
export const emailVerificationRequest = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.user!.email;

    const { redirectUrl } = req.body;

    const user = await userModel.findOne({ email: req.user!.email });

    // generate token
    const emailVerificationToken = await user!.generateEmailVerificationToken();

    // save token
    await user!.save();

    // create message and url
    const emailVerificationUrl = `${req.protocol}://localhost:3000/${redirectUrl}?token=${emailVerificationToken}`;

    const message = `Email verification \n\n ${emailVerificationUrl} \n\n If you haven't requested this email, please ignore it. `;

    // send token
    try {
      sendEmail({
        email,
        message,
        subject: "Instagram Clone Tutorial email verification",
      });

      return res.status(200).json({
        success: true,
        message: `Successfully sent email to ${email}`,
      });
    } catch (error) {
      user!.emailVerificationToken = undefined;
      user!.emailVerificationExpire = undefined;

      await user!.save();

      next(new ServerError("Error occured while sending email", 500));
    }
  }
);

// email verification complete -- authVerified: true
export const emailVerificationComplete = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // getting info from the req
    const { token } = req.body;

    if (typeof token !== "string") {
      return next(new ServerError("Token not correctly sent.", 400));
    }

    // creating token hash from token in req
    const emailVerificationToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // finding the user with following conditions
    // 1. same token
    // 2. expire time (in database) >  real time
    const user = await userModel.findOne({
      emailVerificationToken,
      emailVerificationExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return next(
        new ServerError(
          "Email verification token in invalid or has been expired.",
          400
        )
      );
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;

    await user.save();

    return res.status(200).json({ success: true, message: "Email Verified" });
  }
);

// Forgot password request
export const forgotPasswordRequest = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // getting the info from req
    const { email, redirectUrl } = req.body;

    if (typeof email !== "string" || typeof redirectUrl !== "string") {
      next(new ServerError("Email or redirect url not correctly sent.", 400));
    }

    // getting the user from database by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return next(new ServerError("User not found", 404));
    }

    // generating reset password token
    const resetToken = user.generateResetPasswordToken();

    await user.save();

    // create message and url
    const resetPasswordUrl = `${req.protocol}://localhost:3000/${redirectUrl}/?token=${resetToken}`;

    const message = `Password Recovery \n\n ${resetPasswordUrl} \n\n If you haven't requested this email, please ignore it. `;

    // send token
    try {
      sendEmail({
        email,
        message,
        subject: "Instagram Clone Tutorial Password Recovery",
      });

      return res.status(200).json({
        success: true,
        message: `Successfully sent email to ${email}`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      next(new ServerError("Error occured while sending email", 500));
    }
  }
);

// password reset complete
export const forgotPasswordComplete = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // getting info from the req
    const { token, password } = req.body;

    if (typeof token !== "string" || typeof password !== "string") {
      return next(
        new ServerError("Token or Password not correctly sent.", 400)
      );
    }

    // creating token hash from token in req
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // finding the user with following conditions
    // 1. same token
    // 2. expire time (in database) >  real time
    const user = await userModel.findOne({
      resetPasswordToken,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return next(
        new ServerError(
          "Password reset token in invalid or has been expired.",
          400
        )
      );
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({ success: true, message: "Changed password" });
  }
);
