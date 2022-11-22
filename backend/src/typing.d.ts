import { Schema } from "mongoose";

declare global {
  namespace Express {
    export interface Request {
      user?: user;
    }
  }
}

type mongooseObject = {
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export interface user extends mongooseObject {
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  emailVerificationToken?: string;
  emailVerificationExpire?: Date;
}

export interface post extends mongooseObject {
  caption: string;
  image: {
    public_id: string;
    width: number;
    height: number;
    url: string;
  };
  user: Schema.Types.ObjectId;
  comments: comment[];
  likes: like[];
}

export type comment = {
  user: Schema.Types.ObjectId;
  _id: Schema.Types.ObjectId;
  caption: string;
  commentedAt: Date;
};

export type like = {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  likedAt: Date;
};

export interface userSchema extends user {
  _doc: user;
  generateJWTToken(): Function<string>;
  comparePassword(password: string): Function<string>;
  generateEmailVerificationToken(): Function<string>;
  generateResetPasswordToken(): Function<string>;
}

export interface postSchema extends post {
  _doc: post;
}

export type authMiddlewareOptions = {
  allowNonVerifiedEmail: boolean;
};

export type sendEmailOption = {
  email: string;
  subject: string;
  message: string;
};

export type uploadCloudinaryOptions = {
  public_id?: string;
  transformation?: {
    width: number;
    height: number;
    crop?: "crop";
  };
  folder?: string;
};
