import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { forgotPasswordRequest, login } from "../../redux/actions/userActions";
import wrapper, { RootState, useAsyncDispatch } from "../../redux/store";
// import { useRouter } from "next/navigation";
import { useRouter } from "next/router";
import { userLoading } from "../../utils/enums";
import { toast } from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { DotPulse } from "@uiball/loaders";
import { GetServerSideProps } from "next";

type Props = {};

type forgotPasswordForm = {
  email: string;
};

function ForgotPassword({}: Props) {
  const [toastId, setToastId] = useState<string | undefined>(undefined);

  const asyncDispatch = useAsyncDispatch();

  const { loading, details, error } = useSelector(
    (state: RootState) => state.user
  );

  const router = useRouter();

  const { register, handleSubmit } = useForm<forgotPasswordForm>();

  useEffect(() => {
    if (loading === userLoading.FORGOTPASSWORD) {
      const toastId = toast.loading("Sending password recovery");
      setToastId(toastId);
    }

    if (error && toastId) {
      toast.error(error, {
        id: toastId,
      });
      setToastId(undefined);
    }

    if (loading === userLoading.IDLE && toastId && !error) {
      toast.success("Password recovery sent", {
        id: toastId,
      });
      setToastId(undefined);
    }
  }, [loading]);

  const onSubmit: SubmitHandler<forgotPasswordForm> = async (data) => {
    asyncDispatch(
      forgotPasswordRequest({
        email: data.email,
        redirectUrl: "auth/password-reset",
      })
    );
  };

  return (
    <div className="grid h-screen place-items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:min-w-[25rem] min-w-full px-4 space-y-5"
      >
        <div className="">
          <h1 className="font-bold text-2xl">👁️ Forgot Password</h1>
        </div>
        <input
          type="email"
          className="authInput"
          placeholder="Please enter your email"
          {...register("email", { required: true })}
        />

        <button
          type="submit"
          className="authButton bg-sky-500 shadow-sky-100 shadow-lg text-white hover:bg-sky-400"
        >
          {loading === userLoading.LOGIN ? (
            <div className="my-2">
              <DotPulse size={40} speed={1.3} color="white" />
            </div>
          ) : (
            <p>Send Recovery</p>
          )}
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
