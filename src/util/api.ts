const getPath = (path: string) => {
  const base = import.meta.env.VITE_API_PATH;
  return base + path;
};

export const postData = async (path: string, body: any) => {
  const res = await fetch(getPath(path), {
    method: "POST",
    body: JSON.stringify(body),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.json();
};

const simpleRequest = async (path: string, method: "GET" | "DELETE") => {
  const res = await fetch(getPath(path), {
    method,
    credentials: "include",
  });
  return res.json();
};

export const getData = async (path: string) => simpleRequest(path, "GET");
export const deleteData = async (path: string) => simpleRequest(path, "DELETE");
