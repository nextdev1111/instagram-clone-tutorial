import type { Request, Response, NextFunction } from "express";
import catchAsyncError from "../middlewares/catchAsyncError";
import { postModel } from "../models";
import ServerError from "../utils/serverError";
import cloundinary from "../utils/cloundinary";
import cloudinaryFunctions from "../utils/cloudinaryFunctions";

// create a post -- authVerfied: true
export const createPost = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // fetching info from req
    const { caption, imageUrl } = req.body;

    if (typeof caption !== "string" || typeof imageUrl !== "string") {
      return next(new ServerError("Caption and imageUrl are required.", 400));
    }

    // upload to cloudinary
    const image = await cloudinaryFunctions.uploadImage(imageUrl, {
      folder: "images",
    });

    const postCreated = await postModel.create({
      caption,
      image: {
        public_id: image.public_id,
        width: image.width,
        height: image.height,
        url: image.url,
      },
      user: req.user!._id,
    });

    const post = await postModel
      .findById(postCreated._id)
      .select({
        image: { width: 1, height: 1, url: 1 },
        createdAt: 1,
        caption: 1,
        comments: 1,
        likes: 1,
        user: 1,
      })
      .populate({
        path: "likes",
        populate: {
          path: "user",
          select: { name: 1 },
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: { name: 1 },
        },
      })
      .populate("user", { name: 1 });

    return res.status(201).json({
      success: true,
      post,
    });
  }
);

// delete a post -- authVerified: true
export const deletePost = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // fetching the post id from the params
    const { postId } = req.params;

    // checking if the post userId is same as req.user!.id
    const post = await postModel.findById(postId).select({ user: 1, image: 1 });

    if (!post) {
      return next(new ServerError("No post found to be deleted.", 404));
    }

    if (post.user.toString() !== req.user!._id.toString()) {
      return next(
        new ServerError("You are not authorized to delete this post.", 401)
      );
    }

    await post.remove();

    return res.status(201).json({
      success: true,
      message: "Post has been deleted",
    });
  }
);

// fetch all posts -- authVerified: true
export const fetchAllPosts = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const posts = await postModel
      .find()
      .select({
        image: { width: 1, height: 1, url: 1 },
        user: 1,
        createdAt: 1,
        caption: 1,
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: { name: 1 },
        },
      })
      .populate({
        path: "likes",
        populate: {
          path: "user",
          select: { name: 1 },
        },
      })
      .populate("user", { name: 1 });

    return res.status(200).json({ success: true, posts });
  }
);

// fetch single post
export const fetchSinglePost = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    const post = await postModel
      .findById(postId)
      .select({
        image: { width: 1, height: 1, url: 1 },
        user: 1,
        createdAt: 1,
        caption: 1,
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: { name: 1 },
        },
      })
      .populate("user", { name: 1 });

    if (!post) {
      return next(new ServerError("No post found with this id", 404));
    }

    return res.status(200).json({
      success: true,
      post,
    });
  }
);

// like post -- authVerified: true
export const likePost = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // fetching the postId from params
    const { postId } = req.params;

    // checking if the post with the id exists or not
    const post = await postModel.findById(postId);

    if (!post) {
      return next(new ServerError("No post found with this id", 404));
    }

    // if user has already liked the post --> remove his/her id from likes list
    // if user has not liked the post --> add his/her id to likes list
    const likeIndex = post.likes.findIndex((like) => {
      return like.user.toString() === req.user!._id.toString();
    });

    // user has not liked because likeIndex is found
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push({
        user: req.user!._id,
      } as any);
    }

    const like = post.likes.slice(-1)[0];

    await post.save();

    return res.status(200).json({
      success: true,
      like: likeIndex === -1 ? like : undefined,
    });
  }
);

// create Comment -- authVerified: true (allowNonVerifiedEmail: false)
export const createComment = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // fetching the user
    const user = req.user!;

    // fetching the postId from params
    const { postId } = req.params;

    // fetching the comment info from req.body
    const { caption } = req.body;

    // checking if the post with the id exists or not
    const post = await postModel.findById(postId);

    if (!post) {
      return next(new ServerError("No post found with this id", 404));
    }

    // create a comment
    post.comments.push({
      user: req.user!._id,
      caption: caption,
    } as any);

    await post.save();

    const commentData = (post.comments[post.comments.length - 1] as any)._doc;

    const comment = {
      ...commentData,
      user: {
        id: user._id,
        name: user.name,
      },
    };

    return res.status(200).json({
      success: true,
      comment,
    });
  }
);

// delete comment -- authVerified: true (allnowNonVerifiedEmail: false)
export const deleteComment = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // fetching the postId from params
    const { postId } = req.params;

    // fetching the comment id from req.body
    const { commentId } = req.body;

    // checking if the post with the id exists or not
    const post = await postModel.findById(postId);

    if (!post) {
      return next(new ServerError("No post found with this id", 404));
    }

    const commentIndex = post.comments.findIndex((comment) => {
      return comment.user.toString() === req.user!._id.toString();
    });

    if (commentIndex === -1) {
      return next(
        new ServerError("No comment found with the given comment id", 404)
      );
    }

    // remove the comment to be deleted from the list of comments
    post.comments.splice(commentIndex, 1);

    await post.save();

    return res.status(200).json({
      success: true,
    });
  }
);
