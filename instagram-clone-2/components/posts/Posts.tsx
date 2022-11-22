import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { post } from "../../typing";
import Post from "./Post";

type Props = {};

function Posts({}: Props) {
  const { posts } = useSelector((state: RootState) => state.post);

  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <Post post={post} key={index} />
      ))}
    </div>
  );
}

export default Posts;
