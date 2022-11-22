import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { post } from "../../typing";
import { postLoading } from "../../utils/enums";
import {
  deletePost,
  likePost,
  postComment,
  uploadPost,
} from "../actions/postActions";
import store from "../store";

export type postSliceInitialState = {
  loading: postLoading;
  error?: string;
  posts: post[];
};

export const postSliceInitialState: postSliceInitialState = {
  loading: postLoading.IDLE,
  posts: [],
};

const postSlice = createSlice({
  name: "post",
  initialState: postSliceInitialState,
  reducers: {
    stopLoading: (state, action) => {
      state.loading = postLoading.IDLE;
    },
    addPosts: (state, action) => {
      state.posts = [...state.posts, ...action.payload];
    },
    toogleLike: (state, action) => {
      // postId, like
      const post = state.posts.find(
        (post) => post._id === action.payload.postId
      );

      if (post !== undefined) {
        const likeIndex = post.likes.findIndex(
          (like) => like.user._id === action.payload.like.user._id
        );

        if (likeIndex > -1) {
          post.likes.splice(likeIndex, 1);
        } else {
          post.likes.push({
            _id: action.payload.like._id,
            likedAt: action.payload.like.likedAt,
            user: action.payload.like.user,
          });
        }
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(
      HYDRATE,
      (
        state,
        action: PayloadAction<{ post: postSliceInitialState }, never, never>
      ) => {
        if (
          JSON.stringify(action.payload.post) !==
          JSON.stringify(postSliceInitialState)
        ) {
          state.posts = action.payload.post.posts;
        }
      }
    );
    builder.addCase(uploadPost.pending, (state, action) => {
      state.loading = postLoading.CREATE;
      state.error = undefined;
    });
    builder.addCase(uploadPost.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = postLoading.IDLE;
    });
    builder.addCase(uploadPost.fulfilled, (state, action) => {
      state.posts.push(action.payload);
      state.loading = postLoading.IDLE;
    });

    builder.addCase(deletePost.fulfilled, (state, action) => {
      const postIndex = state.posts.findIndex(
        (post) => post._id === action.payload
      );
      state.posts.splice(postIndex, 1);
    });

    builder.addCase(postComment.fulfilled, (state, action) => {
      const post = state.posts.find(
        (post) => post._id === action.payload.postId
      );
      post?.comments.push(action.payload.comment);
    });
  },
});

// exporting reducers as default
const postReducers = postSlice.reducer;
export default postReducers;

export const postActions = postSlice.actions;
