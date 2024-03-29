export type NormalResponse<T = {}> = {
  ok: boolean;
  errorCode?: number;
  loggedOut?: boolean;
  data?: T;
};

export type ResponseWithPagination<T> = NormalResponse<T & PaginationResponse>;

export type ExtraQueryFields = {
  limit?: number;
};

export const extraQueryFields: Array<keyof ExtraQueryFields> = ["limit"];

type PaginationQueryParams<T> = {
  pageSize: T;
  nextCursor: T;
};

export type PaginationQueryParamsBackEnd = PaginationQueryParams<string>;
export type PaginationQueryParamsFrontEnd = PaginationQueryParams<number>;
export type PaginationResponse = {
  pagination: {
    nextCursor?: number;
  };
};

export type GetParams = {
  [key: string]: string;
};
