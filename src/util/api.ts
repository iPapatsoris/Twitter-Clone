const buildURL = <T extends string>(path: string, params: T[]) => {
  const base = import.meta.env.VITE_API_PATH;
  const url = new URL(path, base);
  params.forEach((param) => url.searchParams.append(param, ""));

  return url;
};

export const postData = async <T extends string>(
  path: string,
  body: any,
  params: T[] = []
) => {
  const res = await fetch(buildURL(path, params), {
    method: "POST",
    body: JSON.stringify(body),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.json();
};

const simpleRequest = async <T extends string>(
  path: string,
  method: "GET" | "DELETE",
  params: T[]
) => {
  const res = await fetch(buildURL(path, params), {
    method,
    credentials: "include",
  });
  return res.json();
};

export const getData = async <Res, T extends string>(
  path: string,
  params: T[] = []
): Promise<Res> => simpleRequest(path, "GET", params);

export const deleteData = async <T extends string>(
  path: string,
  params: T[] = []
) => simpleRequest(path, "DELETE", params);
