import React, { useState } from "react";
import { post } from "../../typing";
import TimeAgo from "react-timeago";
import { useDispatch, useSelector } from "react-redux";
import { RootState, useAsyncDispatch } from "../../redux/store";
import PostMenuButton from "../PostMenuButton";
import { HeartIcon, TrashIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import Image from "next/legacy/image";
import appFetch from "../../utils/appFetch";
import { useToken } from "../../utils/useCookies";
import { postActions } from "../../redux/slices/postSlice";
import toast from "react-hot-toast";
import { deletePost, postComment } from "../../redux/actions/postActions";

type Props = {
  post: post;
};

function Post({ post }: Props) {
  const { details } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState<"LIKE" | "IDLE">("IDLE");
  const [caption, setCaption] = useState<string>("");
  const [showComments, setShowComments] = useState<boolean>(false);

  const aysncDispatch = useAsyncDispatch();
  const dispatch = useDispatch();

  const likePost = async () => {
    const token = useToken.getCookie();

    setLoading("LIKE");

    try {
      const res = await appFetch({
        path: `post/like/${post._id}`,
        method: "post",
        headers: { token },
      });

      if (res.like !== undefined) {
        const like = {
          likedAt: res.like.likedAt,
          _id: res.like._id,
          user: { _id: details?._id, name: details?.name },
        };
        dispatch(postActions.toogleLike({ postId: post._id, like }));
      } else {
        const like = post.likes.find((like) => like.user._id === details?._id);
        dispatch(postActions.toogleLike({ postId: post._id, like }));
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading("IDLE");
    }
  };

  const hasLiked = post.likes.find((like) => like.user?._id === details?._id);

  const submitComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    aysncDispatch(postComment({ caption, postId: post._id }));
  };

  return (
    <div>
      {/* user info and other buttons */}
      <div className="bg-zinc-100 rounded-t-xl flex items-center justify-between py-4 px-6">
        {/* name & date */}
        <div className="flex flex-col">
          <span className="font-bold">{post.user.name}</span>
          <span>
            <TimeAgo date={post.createdAt} />
          </span>
        </div>

        {/* delete button */}
        <div>
          {post.user._id === details?._id && (
            <>
              <PostMenuButton
                Icon={TrashIcon}
                className="bg-red-500 text-white hover:bg-red-400"
                onClick={() => {
                  aysncDispatch(deletePost(post._id));
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* image and caption */}
      <div className="relative">
        <Image
          src={post.image.url}
          width={post.image.width}
          height={post.image.height}
          alt="image"
          layout="responsive"
        />

        {/* caption */}
        <div className="items-center flex space-x-3 absolute bottom-0 right-0 w-full backdrop-blur-lg bg-black/30 p-4">
          <div className="flex space-x-3 items-center">
            <PostMenuButton
              className="bg-white text-pink-500 hover:opacity-90"
              Icon={hasLiked ? SolidHeartIcon : HeartIcon}
              onClick={() => {
                likePost();
              }}
              loading={loading === "LIKE"}
              loadingColor="#ec4899"
            />
            <span className="font-bold text-white">
              {post.likes.length} likes
            </span>
          </div>
          <p className="text-white">{post.caption}</p>
        </div>
      </div>

      {/* comments */}
      <div className="bg-zinc-100 rounded-b-3xl py-4 px-6">
        {/* input box */}
        <form
          onSubmit={submitComment}
          className="flex justify-between items-center space-x-3"
        >
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Comment"
            className="outline-none w-full p-3 rounded-xl"
          />
          <button className="bg-sky-500 text-white shadow-sky-200 shadow-md p-2 rounded-md hover:bg-sky-400 cursor-pointer">
            Post
          </button>
        </form>

        {/* comments opener */}
        <div className="mt-4">
          <button
            onClick={() => {
              setShowComments(!showComments);
            }}
            className="p-3 font-normal bg-white rounded-md"
          >
            Show Comments
          </button>
        </div>

        <div className="mt-4">
          {/* comments */}
          {showComments && (
            <div className="space-y-3">
              {post.comments.map((comment, index) => (
                <div key={index} className="space-x-3">
                  <span className="font-sm">{comment.user.name}</span>
                  <span className="font-medium">{comment.caption}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
