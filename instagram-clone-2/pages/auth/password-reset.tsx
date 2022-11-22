import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  forgotPasswordRequest,
  login,
  passwordReset,
} from "../../redux/actions/userActions";
import wrapper, { RootState, useAsyncDispatch } from "../../redux/store";
// import { useRouter } from "next/navigation";
import { useRouter } from "next/router";
import { userLoading } from "../../utils/enums";
import { toast } from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { DotPulse } from "@uiball/loaders";

type Props = {};

type passwordResetForm = {
  password: string;
};

function ForgotPassword({}: Props) {
  const [toastId, setToastId] = useState<string | undefined>(undefined);

  const asyncDispatch = useAsyncDispatch();

  const { loading, details, error } = useSelector(
    (state: RootState) => state.user
  );

  const router = useRouter();
  const { token } = router.query;

  const { register, handleSubmit } = useForm<passwordResetForm>();

  useEffect(() => {
    if (loading === userLoading.PASSWORDRESET) {
      const toastId = toast.loading("Changing password");
      setToastId(toastId);
    }

    if (error && toastId) {
      toast.error(error, {
        id: toastId,
      });
      setToastId(undefined);
    }

    if (loading === userLoading.IDLE && toastId && !error) {
      toast.success("Changed password", {
        id: toastId,
      });

      setToastId(undefined);
      router.replace("/auth/login");
    }
  }, [loading]);

  const onSubmit: SubmitHandler<passwordResetForm> = async (data) => {
    if (typeof token !== "string") {
      return toast.error("Token is not valid");
    }
    asyncDispatch(
      passwordReset({
        password: data.password,
        token,
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
          <h1 className="font-bold text-2xl">⌚ Password Reset</h1>
        </div>
        <input
          type="password"
          className="authInput"
          placeholder="Please enter a new password"
          {...register("password", { required: true })}
        />

        <button
          type="submit"
          disabled={loading === userLoading.PASSWORDRESET}
          className="authButton bg-sky-500 shadow-sky-100 shadow-lg text-white hover:bg-sky-400"
        >
          {loading === userLoading.PASSWORDRESET ? (
            <div className="my-2">
              <DotPulse size={40} speed={1.3} color="white" />
            </div>
          ) : (
            <p>Change password</p>
          )}
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
