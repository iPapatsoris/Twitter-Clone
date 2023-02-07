export type NormalResponse<T = {}> = {
  ok: boolean;
  errorCode?: number;
  data?: T;
};
