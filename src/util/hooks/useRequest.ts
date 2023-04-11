import { NormalResponse } from "../../../backend/src/api/common";
import { useAuth } from "./useAuth";

const useRequest = () => {
  const { setUser } = useAuth();

  const buildURL = <T extends string>(path: string, params: readonly T[]) => {
    const base = import.meta.env.VITE_API_PATH;
    const url = new URL(path, base);
    params.forEach((param) => url.searchParams.append(param, ""));

    return url;
  };

  const postData = async <T extends string>(
    path: string,
    body: any,
    params: T[] = []
  ) => {
    const res: Response = await fetch(buildURL(path, params), {
      method: "POST",
      body: JSON.stringify(body),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: NormalResponse = await res.json();
    if (data.loggedOut) {
      setUser(null);
    }

    return data as any;
  };

  const simpleRequest = async <T extends string>(
    path: string,
    method: "GET" | "DELETE",
    params: readonly T[]
  ) => {
    const res = await fetch(buildURL(path, params), {
      method,
      credentials: "include",
    });

    const data: NormalResponse = await res.json();
    if (data.loggedOut) {
      setUser(null);
    }

    return data as any;
  };

  const getData = async <Res, T extends string>(
    path: string,
    params: readonly T[] = []
  ): Promise<Res> => {
    return simpleRequest(path, "GET", params);
  };

  const deleteData = async <T extends string>(path: string, params: T[] = []) =>
    simpleRequest(path, "DELETE", params);

  return { getData, deleteData, postData };
};

export default useRequest;
