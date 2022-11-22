import { user } from "../typing";
import appFetch from "./appFetch";
const autoLogin = async (token?: string) => {
  try {
    if (!token) {
      return undefined;
    }

    const res = await appFetch({
      path: `user/details`,
      method: "get",
      headers: {
        token,
      },
    });

    const user: user = res.user;

    return user;
  } catch (error) {
    return undefined;
  }
};

const emailVerificationComplete = async (
  verificationToken: string,
  token?: string
) => {
  try {
    if (!token) {
      return false;
    }

    const res = await appFetch({
      path: `user/email-verify`,
      method: "put",
      headers: {
        token,
      },
      body: { token: verificationToken },
    });

    if (res.success === true) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
};

export { autoLogin, emailVerificationComplete };
