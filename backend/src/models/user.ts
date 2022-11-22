import mongoose, { Schema } from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import type { userSchema as userSchemaType } from "../typing";

const userSchema = new Schema<userSchemaType>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is a required field"],
      unique: true,
      maxLength: [30, "Name should not exceed 30 characters"],
      minLength: [4, "Name should have more than 4 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is a required field"],
      unique: true,
      validate: [validator.isEmail, "Entered email is not valid"],
    },

    password: {
      type: String,
      trim: true,
      required: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerificationToken: String,
    emailVerificationExpire: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre(
  "save",
  async function (next: mongoose.CallbackWithoutResultAndOptionalError) {
    // modify password
    if (this.isModified("password")) {
      this.password = bcryptjs.hashSync(this.password as string, 10);
    }

    next();
  }
);

// JWT TOKEN GENERATOR
userSchema.methods.generateJWTToken = function (): string {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET as string);

  return token;
};

// Compare password
userSchema.methods.comparePassword = function (password: string): boolean {
  const passwordMatched: boolean = bcryptjs.compareSync(
    password,
    this.password
  );

  return passwordMatched;
};

// generating email verification token
userSchema.methods.generateEmailVerificationToken = function (): string {
  // Generating token
  const token = crypto.randomBytes(20).toString("hex");

  // adding (hashed) emailVerificationToken to userSchema
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // 15 mintues from now
  this.emailVerificationExpire = Date.now() + 15 * 60 * 1000;

  return token;
};

// generating email verification token
userSchema.methods.generateResetPasswordToken = function (): string {
  // Generating token
  const token = crypto.randomBytes(20).toString("hex");

  // adding (hashed) emailVerificationToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // 15 mintues from now
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return token;
};

const model = mongoose.model("user", userSchema);

export default model;
