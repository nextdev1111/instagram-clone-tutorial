import cookies from "js-cookie";
import { GetServerSidePropsContext } from "next";

type cookiesReturnType = string | undefined;

class UseCookies {
  constructor(public key: string) {}

  setCookie(value: string, options?: cookies.CookieAttributes) {
    if (window) {
      cookies.set(this.key, value, options);
    }
  }

  removeCookie() {
    if (window) {
      cookies.remove(this.key);
    }
  }

  private getCookieFromBrowser(): cookiesReturnType {
    return cookies.get(this.key);
  }

  private getCookieFromServer(
    req: GetServerSidePropsContext["req"]
  ): cookiesReturnType {
    if (!req.headers.cookie) {
      return undefined;
    }

    const rawCookie = req.headers.cookie
      .split(";")
      .find((c: string) => c.trim().startsWith(`${this.key}=`));

    if (!rawCookie) {
      return undefined;
    }

    return rawCookie.split("=")[1];
  }

  getCookie(req?: GetServerSidePropsContext["req"]): cookiesReturnType {
    if (!req && window) {
      return this.getCookieFromBrowser();
    } else if (req) {
      return this.getCookieFromServer(req);
    } else {
      throw new Error("Not able to retrieve cookies");
    }
  }
}

export const useToken = new UseCookies("token");

export default UseCookies;
