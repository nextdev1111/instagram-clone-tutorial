import { useToken } from "./../../utils/useCookies";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { comment, post } from "../../typing";
import appFetch from "../../utils/appFetch";
const uploadPost = createAsyncThunk(
  "post/upload",
  async ({ imageUrl, caption }: { imageUrl: string; caption: string }) => {
    const token = useToken.getCookie();

    const res = await appFetch({
      path: "post",
      method: "post",
      body: { imageUrl, caption },
      headers: { token },
    });

    const post: post = res.post;

    return post;
  }
);

const likePost = createAsyncThunk("post/like", async (postId: string) => {
  const res = await appFetch({
    path: `post/like/${postId}`,
    method: "post",
  });

  return postId;
});

const deletePost = createAsyncThunk("post/delete", async (postId: string) => {
  const token = useToken.getCookie();

  const res = await appFetch({
    path: `post/${postId}`,
    method: "delete",
    headers: { token },
  });

  return postId;
});

const postComment = createAsyncThunk(
  "post/comment",
  async ({ postId, caption }: { postId: string; caption: string }) => {
    const token = useToken.getCookie();

    const res = await appFetch({
      path: `post/comment/${postId}`,
      method: "post",
      headers: { token },
      body: { caption },
    });

    const comment: comment = res.comment;

    return { postId, comment };
  }
);

export { uploadPost, likePost, deletePost, postComment };
