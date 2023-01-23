export type Response = {
  ok: boolean;
  errorCode?: number;
};

export type Fields<T> = {
  fields: T[];
};
