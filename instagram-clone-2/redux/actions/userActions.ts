import { createAsyncThunk } from "@reduxjs/toolkit";
import { user } from "../../typing";
import appFetch from "../../utils/appFetch";
import { useToken } from "../../utils/useCookies";

// pending, rejected , fulfileed

const login = createAsyncThunk(
  "user/login",
  async ({ email, password }: { email: string; password: string }) => {
    const res = await appFetch({
      path: "user/login",
      method: "post",
      body: { email, password },
    });

    const user: user = res.user;

    useToken.setCookie(user.token);

    return user;
  }
);

const register = createAsyncThunk(
  "user/register",
  async ({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) => {
    const res = await appFetch({
      path: "user/register",
      method: "post",
      body: { email, password, name },
    });

    const user: user = res.user;

    useToken.setCookie(user.token);

    return user;
  }
);

const forgotPasswordRequest = createAsyncThunk(
  "user/forgotpassword",
  async ({ email, redirectUrl }: { email: string; redirectUrl: string }) => {
    const res = await appFetch({
      path: "user/password-reset",
      method: "post",
      body: { email, redirectUrl },
    });

    return true;
  }
);

const passwordReset = createAsyncThunk(
  "user/passwordreset",
  async ({ password, token }: { password: string; token: string }) => {
    const res = await appFetch({
      path: "user/password-reset",
      method: "put",
      body: { password, token },
    });

    return true;
  }
);

const emailVerificationRequest = createAsyncThunk(
  "user/emailverify",
  async () => {
    const token = useToken.getCookie();

    const res = await appFetch({
      path: "user/email-verify",
      method: "post",
      headers: { token },
      body: { redirectUrl: `auth/email-verification` },
    });

    return true;
  }
);

export {
  login,
  register,
  forgotPasswordRequest,
  passwordReset,
  emailVerificationRequest,
};
