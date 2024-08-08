import { render, cleanup, screen, RenderResult } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import Home, { timelinePageSize } from "../Home";
import { MemoryRouter } from "react-router-dom";
import { getPagePath } from "../../util/paths";
import { server } from "../../mocks/setupTests";
import { tweetTestData } from "../../mocks/handlers/timeline/data";
import { overrideHandlers } from "../../mocks/handlers/timeline";

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        // staleTime: Infinity,
      },
    },
  });

const renderWithClient = (
  ui: React.ReactElement,
  options?: any
): RenderResult => {
  return render(
    <QueryClientProvider client={createQueryClient()}>
      {ui}
    </QueryClientProvider>,
    options
  );
};

describe("down timeline", () => {
  beforeAll(() => {
    server.use(overrideHandlers.ignoreUpTimelineHandler);
  });
  afterAll(() => {
    server.resetHandlers();
  });

  const { tweetTextFormat, startingTweetID, mockedTimeline } = tweetTestData;

  test("show first 10 posts", async () => {
    renderWithClient(
      <MemoryRouter initialEntries={[getPagePath("home")]}>
        <Home />
      </MemoryRouter>
    );
    await screen.findByText(tweetTextFormat + startingTweetID);

    const displayedTweets = screen.getAllByText(tweetTextFormat, {
      exact: false,
    });

    expect(displayedTweets).toHaveLength(timelinePageSize);
    displayedTweets.forEach((element, index) =>
      expect(element.textContent).toBe(mockedTimeline[index].text)
    );
  });

  test("ask for first 10 posts but show less because there aren't enough", async () => {
    server.use(overrideHandlers.timelineWithFewPosts());
    renderWithClient(
      <MemoryRouter initialEntries={[getPagePath("home")]}>
        <Home />
      </MemoryRouter>
    );
    await screen.findByText(tweetTextFormat + startingTweetID);
    const displayedTweets = screen.getAllByText(tweetTextFormat, {
      exact: false,
    });

    expect(displayedTweets).toHaveLength(2);
    displayedTweets.forEach((element, index) =>
      expect(element.textContent).toBe(mockedTimeline[index].text)
    );
  });
});
