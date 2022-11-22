import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import wrapper, { RootState, useAsyncDispatch } from "../redux/store";
import { GetServerSideProps } from "next";
import { useToken } from "../utils/useCookies";
import { userActions } from "../redux/slices/userSlice";
import { autoLogin } from "../utils/userActions";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { userLoading } from "../utils/enums";
import toast from "react-hot-toast";
import { emailVerificationRequest } from "../redux/actions/userActions";
import CreatePost from "../components/CreatePost";
import Posts from "../components/posts/Posts";
import { fetchPosts } from "../utils/postActions";
import { postActions } from "../redux/slices/postSlice";

const Home: NextPage = () => {
  const [toastId, setToastId] = useState<string | undefined>(undefined);
  const { loading, details, error } = useSelector(
    (state: RootState) => state.user
  );

  const asyncDispatch = useAsyncDispatch();

  const router = useRouter();

  useEffect(() => {
    if (loading === userLoading.EMAILVERIFICATIONREQUEST) {
      const toastId = toast.loading("Sending email to your inbox");
      setToastId(toastId);
    }

    if (error && toastId) {
      toast.error(error, {
        id: toastId,
      });
    }

    if (loading === userLoading.IDLE && toastId && !error) {
      toast.success("Verification Email sent", {
        id: toastId,
      });
    }
  }, [loading]);

  return (
    <div className="flex justify-center ">
      <div className="w-full max-w-[600px]">
        <div className="space-y-6">
          <CreatePost />
          <Posts />
        </div>
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (context) => {
    const { details } = store.getState().user;
    const token = useToken.getCookie(context.req);

    if (!token) {
      return {
        redirect: {
          permanent: false,
          destination: "/auth/login",
        },
      };
    }

    if (!details) {
      const user = await autoLogin(token);

      store.dispatch(userActions.changeDetails(user));
    }

    const posts = await fetchPosts(token);

    store.dispatch(postActions.addPosts(posts));

    return {
      props: {},
    };
  });
