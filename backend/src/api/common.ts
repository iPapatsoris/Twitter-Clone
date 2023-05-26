export type NormalResponse<T = {}> = {
  ok: boolean;
  errorCode?: number;
  loggedOut?: boolean;
  data?: T;
};

export type ExtraQueryFields = {
  limit?: number;
};

export const extraQueryFields: Array<keyof ExtraQueryFields> = ["limit"];
