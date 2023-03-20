const getPath = (path: string) => {
  const base = import.meta.env.VITE_API_PATH;
  return base + path;
};

export const postData = async (path: string, body: any) => {
  const res = await fetch(getPath(path), {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.json();
};

export const getData = async (path: string) => {
  const res = await fetch(getPath(path), {
    method: "GET",
  });
  return res.json();
};
