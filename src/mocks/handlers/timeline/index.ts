import { http, HttpResponse } from "msw";
import { URLBase } from "../../../util/request";
import { PaginationQueryParamsBackEnd } from "../../../../backend/src/api/common";
import { GetTimeline } from "../../../../backend/src/api/tweet";
import { tweetTestData } from "./data";

const getQueryParamFunction =
  <AllowedQueryParams extends string>() =>
  (url: URL, param: AllowedQueryParams) =>
    url.searchParams.get(param);

export const handlers = [
  http.get<any, any, GetTimeline["response"]>(
    URLBase + "/tweet/timeline/down",
    ({ request }) => {
      const url = new URL(request.url);
      const getQueryParam =
        getQueryParamFunction<keyof PaginationQueryParamsBackEnd>();
      const pageSizeParam = getQueryParam(url, "pageSize");
      let nextCursorParam = getQueryParam(url, "nextCursor");

      if (!nextCursorParam || !pageSizeParam) {
        return HttpResponse.json({ ok: false });
      }

      const nextCursor = parseInt(nextCursorParam);
      const pageSize = parseInt(pageSizeParam);
      const { mockedTimeline } = tweetTestData;

      const startIndex =
        nextCursor === -1
          ? 0
          : mockedTimeline.findIndex(({ id }) => id === nextCursor);
      const numberOfItemsToReturn = Math.min(
        mockedTimeline.length - startIndex,
        pageSize
      );
      const endIndex = startIndex + numberOfItemsToReturn;
      const futureNextCursor =
        endIndex !== mockedTimeline.length
          ? mockedTimeline[endIndex].id
          : undefined;

      return HttpResponse.json({
        ok: true,
        data: {
          pagination: { nextCursor: futureNextCursor },
          tweetsAndRetweets: mockedTimeline
            .slice(startIndex, endIndex)
            .map((t) => ({ tweet: t })),
        },
      });
    }
  ),
  http.post(URLBase + "/tweet/timeline/down", () =>
    HttpResponse.json({ ok: false })
  ),
];

const ignoreUpTimelineHandler = http.get(URLBase + "/tweet/timeline/up", () =>
  HttpResponse.json({ ok: false })
);

const timelineWithFewPosts = () =>
  http.get<any, any, GetTimeline["response"]>(
    URLBase + "/tweet/timeline/down",
    () => {
      const { mockedTimeline } = tweetTestData;

      return HttpResponse.json({
        ok: true,
        data: {
          pagination: { nextCursor: -1 },
          tweetsAndRetweets: mockedTimeline
            .slice(0, 2)
            .map((t) => ({ tweet: t })),
        },
      });
    },
    { once: true }
  );

export const overrideHandlers = {
  ignoreUpTimelineHandler,
  timelineWithFewPosts,
};
