import type { appFetch as appFetchType } from "./../typing.d";
import { useToken } from "./useCookies";

const appFetch = async ({ body, method, headers, path }: appFetchType) => {
  try {
    const res = await fetch(`http://localhost:5000/${path}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: method === "get" ? undefined : JSON.stringify(body),
    });

    if (res.status === 200 || res.status === 201) {
    } else {
      const result = await res.json();

      throw Error(result.message);
    }

    const result = await res.json();

    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default appFetch;
