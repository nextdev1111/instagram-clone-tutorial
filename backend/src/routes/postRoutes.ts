import { Router } from "express";
import {
  createComment,
  createPost,
  deleteComment,
  deletePost,
  fetchAllPosts,
  likePost,
} from "../controllers/postControllers";
import authVerify from "../middlewares/authVerify";

const router = Router();

// create post
router.post("/", authVerify(), createPost);
// delete post
router.delete("/:postId", authVerify(), deletePost);
// fetch all posts
router.get("/", authVerify(), fetchAllPosts);
// fetch single posts
router.get("/:postId", authVerify(), fetchAllPosts);
// like a post
router.post("/like/:postId", authVerify(), likePost);
// comment a post
router.post(
  "/comment/:postId",
  authVerify({ allowNonVerifiedEmail: false }),
  createComment
);
// comment a post
router.delete(
  "/comment/:postId",
  authVerify({ allowNonVerifiedEmail: false }),
  deleteComment
);

export default router;
