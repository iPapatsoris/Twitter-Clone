import { NormalResponse } from "../../backend/src/api/common";
import { useAuthStore } from "../store/AuthStore";

const buildURL = <T extends string>(path: string, params: readonly T[]) => {
  const base = import.meta.env.VITE_API_PATH;
  const url = new URL(path, base);
  params.forEach((param) => url.searchParams.append(param, ""));

  return url;
};

const request = async <T extends string>(
  path: string,
  method: "GET" | "DELETE" | "PATCH" | "POST",
  params: readonly T[],
  body: any = {}
) => {
  const options: RequestInit = {
    method,
    credentials: "include",
  };
  if (method === "POST" || method === "PATCH") {
    options.body = JSON.stringify(body);
    options.headers = {
      "Content-Type": "application/json",
    };
  }

  const res = await fetch(buildURL(path, params), options);

  const data: NormalResponse = await res.json();
  const { loggedInUser, setLoggedInUser } = useAuthStore.getState();
  if (loggedInUser && data.loggedOut) {
    setLoggedInUser(null);
  }

  return data as any;
};

export const getData = async <Res, T extends string = string>(
  path: string,
  params: readonly T[] = []
): Promise<Res> => {
  return request(path, "GET", params);
};

export const deleteData = async <Res, T extends string>(
  path: string,
  params: T[] = []
): Promise<Res> => request(path, "DELETE", params);

export const patchData = async <T extends string>(
  path: string,
  body: any,
  params: readonly T[] = []
) => request(path, "PATCH", params, body);

export const postData = async <Res, T extends string>(
  path: string,
  body: any,
  params: readonly T[] = []
): Promise<Res> => request(path, "POST", params, body);
