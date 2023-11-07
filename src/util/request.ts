import { GetParams, NormalResponse } from "../../backend/src/api/common";
import { useAuthStore } from "../store/AuthStore";

// Convert values to query parameters in the following way:
// create an object with "valuelessFields" as keys with empty string values,
// additionally add the key-value pairs of "params" but convert the values
// to string.
export const addQueryParams = (
  valuelessFields: readonly string[],
  params?: { [key: string]: any }
) => {
  const queryParams: GetParams = {};
  valuelessFields.forEach((param) => (queryParams[param] = ""));
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) {
        continue;
      }
      queryParams[key] = value.toString();
    }
  }

  return queryParams;
};

const buildURL = (path: string, params: GetParams) => {
  const base = import.meta.env.VITE_API_PATH;
  const url = new URL(path, base);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }

  return url;
};

const request = async (
  path: string,
  method: "GET" | "DELETE" | "PATCH" | "POST",
  params: GetParams,
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

export const getData = async <Res>(
  path: string,
  params: GetParams = {}
): Promise<Res> => {
  return request(path, "GET", params);
};

export const deleteData = async <Res>(
  path: string,
  params: GetParams = {}
): Promise<Res> => request(path, "DELETE", params);

export const patchData = async <Res>(
  path: string,
  body: any,
  params: GetParams = {}
): Promise<Res> => request(path, "PATCH", params, body);

export const postData = async <Res>(
  path: string,
  body: any,
  params: GetParams = {}
): Promise<Res> => request(path, "POST", params, body);
