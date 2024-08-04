import { render, screen, RenderResult } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import Home, { timelinePageSize } from "../Home";
import { MemoryRouter } from "react-router-dom";
import { getPagePath } from "../../util/paths";
import { server } from "../../mocks/setupTests";
import { ignoreUpTimelineHandler } from "../../mocks/handlers/timeline";
import { tweetTestData } from "../../mocks/handlers/timeline/data";

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
  queryClient?: QueryClient,
  options?: any
): RenderResult => {
  const actualQueryClient = queryClient ?? createQueryClient();
  return render(
    <QueryClientProvider client={actualQueryClient}>{ui}</QueryClientProvider>,
    options
  );
};

describe("down timeline", () => {
  beforeAll(() => {
    server.use(ignoreUpTimelineHandler);
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
});
