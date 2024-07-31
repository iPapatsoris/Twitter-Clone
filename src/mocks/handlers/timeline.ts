import { http } from "msw";
import { URLBase } from "../../util/request";
import { PaginationQueryParamsBackEnd } from "../../../backend/src/api/common";

const getQueryParamFunction =
  <AllowedQueryParams extends string>() =>
  (url: URL, param: AllowedQueryParams) =>
    url.searchParams.get(param);

export const handlers = [
  http.get(URLBase + "/tweet/timeline/down", ({ request }) => {
    const url = new URL(request.url);

    const getQueryParam =
      getQueryParamFunction<keyof PaginationQueryParamsBackEnd>();
    const pageSize = getQueryParam(url, "pageSize");
    const nextCursor = getQueryParam(url, "nextCursor");

    console.log(pageSize);
    console.log(nextCursor);
  }),
];
