export type NormalResponse<T = {}> = {
  ok: boolean;
  errorCode?: number;
  loggedOut?: boolean;
  data?: T;
};
