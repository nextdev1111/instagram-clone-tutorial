import { post } from "../typing";
import appFetch from "./appFetch";

const fetchPosts = async (token: string) => {
  try {
    const res = await appFetch({
      path: `post`,
      method: "get",
      headers: { token },
    });

    const posts: post[] = res.posts;

    return posts;
  } catch (error) {
    return undefined;
  }
};

export { fetchPosts };
