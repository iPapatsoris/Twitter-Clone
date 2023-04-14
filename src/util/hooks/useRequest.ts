import { NormalResponse } from "../../../backend/src/api/common";
import { useAuth } from "./useAuth";

const useRequest = () => {
  const { user, setUser } = useAuth();

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
    if (user && data.loggedOut) {
      setUser(null);
    }

    return data as any;
  };

  const getData = async <Res, T extends string>(
    path: string,
    params: readonly T[] = []
  ): Promise<Res> => {
    return request(path, "GET", params);
  };

  const deleteData = async <T extends string>(path: string, params: T[] = []) =>
    request(path, "DELETE", params);

  const patchData = async <T extends string>(
    path: string,
    body: any,
    params: readonly T[] = []
  ) => request(path, "PATCH", params, body);

  const postData = async <T extends string>(
    path: string,
    body: any,
    params: readonly T[] = []
  ) => request(path, "POST", params, body);

  return { getData, deleteData, patchData, postData };
};

export default useRequest;
