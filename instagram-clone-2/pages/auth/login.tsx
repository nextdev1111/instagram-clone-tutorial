import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/actions/userActions";
import wrapper, { RootState, useAsyncDispatch } from "../../redux/store";
// import { useRouter } from "next/navigation";
import { useRouter } from "next/router";
import { userLoading } from "../../utils/enums";
import { toast } from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { DotPulse } from "@uiball/loaders";
import Link from "next/link";
import { GetServerSideProps } from "next";

type Props = {};

type LoginForm = {
  email: string;
  password: string;
};

function Login({}: Props) {
  const [toastId, setToastId] = useState<string | undefined>(undefined);

  const asyncDispatch = useAsyncDispatch();

  const { loading, details, error } = useSelector(
    (state: RootState) => state.user
  );

  const router = useRouter();

  const { register, handleSubmit } = useForm<LoginForm>();

  useEffect(() => {
    if (loading === userLoading.LOGIN) {
      const toastId = toast.loading("Logining");
      setToastId(toastId);
    }

    if (error && toastId) {
      toast.error(error, {
        id: toastId,
      });
    }

    if (details && toastId) {
      toast.success("You are logged in", {
        id: toastId,
      });
      router.replace("/");
    }
  }, [loading]);

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    asyncDispatch(login({ email: data.email, password: data.password }));
  };

  return (
    <div className="grid h-screen place-items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:min-w-[25rem] min-w-full px-4 space-y-5"
      >
        <div className="">
          <h1 className="font-bold text-2xl">🪴 Login</h1>
        </div>
        <input
          type="email"
          className="authInput"
          placeholder="Please enter your email"
          {...register("email", { required: true })}
        />
        <input
          type="password"
          className="authInput"
          placeholder="Please enter your password"
          {...register("password", { required: true })}
        />

        <div className="flex justify-between ">
          <Link href={"/auth/forgot-password"}>
            <p className="font-medium bg-stone-100 rounded-md p-2 cursor-pointer">
              Forgot Password ?
            </p>
          </Link>
          <Link href={"/auth/register"}>
            <p className="font-medium bg-stone-100 rounded-md p-2 cursor-pointer">
              Register
            </p>
          </Link>
        </div>

        <button
          type="submit"
          className="authButton bg-sky-500 shadow-sky-100 shadow-lg text-white hover:bg-sky-400"
        >
          {loading === userLoading.LOGIN ? (
            <div className="my-2">
              <DotPulse size={40} speed={1.3} color="white" />
            </div>
          ) : (
            <p>Login</p>
          )}
        </button>
      </form>
    </div>
  );
}

export default Login;
