import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../redux/slices/userSlice";
import { RootState } from "../redux/store";
import { useToken } from "../utils/useCookies";

type Props = {};

function Navbar({}: Props) {
  const { details } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const logout = () => {
    useToken.removeCookie();

    dispatch(userActions.logout(null));
    router.replace("/auth/login");
  };

  return (
    <div className="flex justify-center text-lg">
      <div className="flex items-center justify-between p-3 min-w-[600px]">
        <div className="">
          <Link href="/">
            <span className="font-bold">Instagram</span>
          </Link>
        </div>

        {/* menu */}
        <div className="flex space-x-3">
          <button
            className={`rounded-md ${
              details ? "bg-red-500" : "bg-sky-500"
            } px-3 py-1 text-white shadow-lg  ${
              details ? "shadow-red-200" : "shadow-sky-200"
            }  border-2  ${details ? "border-red-700" : "border-sky-700"}  ${
              details ? "hover:bg-red-400" : "hover:bg-sky-400"
            } transition-all duration-150`}
            onClick={logout}
          >
            {details ? "Logout" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
