import { GetServerSideProps } from "next";
import React from "react";
import { userActions } from "../../redux/slices/userSlice";
import wrapper from "../../redux/store";
import { useToken } from "../../utils/useCookies";
import { emailVerificationComplete } from "../../utils/userActions";

type Props = {};

function EmailVerification({}: Props) {
  return <div>EmailVerification</div>;
}

export default EmailVerification;

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (context) => {
    const { token: verificationToken } = context.query;
    const token = useToken.getCookie(context.req);

    if (typeof verificationToken !== "string") {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const verificationComplete: boolean = await emailVerificationComplete(
      verificationToken,
      token
    );

    if (verificationComplete) {
      store.dispatch(userActions.changeEmailVerifiedOption(null));
    }

    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  });
