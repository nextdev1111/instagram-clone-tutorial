import mongoose, { Schema } from "mongoose";
import { postSchema } from "../typing";
import cloundinary from "../utils/cloundinary";

const postSchema = new Schema<postSchema>(
  {
    caption: {
      required: [true, "Caption is required field"],
      type: String,
      trim: true,
    },
    image: {
      public_id: {
        type: String,
        required: true,
      },
      width: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        caption: {
          type: String,
          required: true,
        },
        commentedAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],

    likes: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "user",
          unique: true,
          required: true,
        },
        likedAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

postSchema.pre("remove", async function (next) {
  // destroying the post image from cloudinary

  await cloundinary.uploader.destroy(this.image.public_id);

  next();
});

const model = mongoose.model("post", postSchema);

export default model;
