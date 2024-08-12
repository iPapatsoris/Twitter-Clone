import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import Home, { timelinePageSize } from "../Home";
import { MemoryRouter } from "react-router-dom";
import { getPagePath } from "../../util/paths";
import { server } from "../../mocks/setupTests";
import { tweetTestData } from "../../mocks/handlers/timeline/data";
import { overrideHandlers } from "../../mocks/handlers/timeline";
import userEvent from "@testing-library/user-event";
import * as useScrollNearBottom from "../../util/hooks/useScrollNearBottom";

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

const renderWithOptions = (
  component: JSX.Element,
  options: {
    withQueryClient?: boolean;
    withUserEvents?: boolean;
    routeEntries?: string[];
  }
) => {
  const { withQueryClient, withUserEvents, routeEntries } = options;
  let wrappedComponent = component;
  if (routeEntries) {
    wrappedComponent = (
      <MemoryRouter initialEntries={routeEntries}>
        {wrappedComponent}
      </MemoryRouter>
    );
  }
  if (withQueryClient) {
    wrappedComponent = (
      <QueryClientProvider client={createQueryClient()}>
        {wrappedComponent}
      </QueryClientProvider>
    );
  }

  return {
    user: withUserEvents ? userEvent.setup() : undefined,
    ...render(wrappedComponent),
  };
};

describe("down timeline", () => {
  beforeAll(() => {
    server.use(overrideHandlers.ignoreUpTimelineHandler);
  });
  afterAll(() => {
    server.resetHandlers();
  });

  const { tweetTextFormat, mockedTimeline } = tweetTestData;

  // Wait until `totalTweets` are displayed, then verify that they are the
  // correct ones.
  const testDisplayedTweets = async ({
    totalTweets,
  }: {
    totalTweets: number;
  }) => {
    let displayedTweets: ReturnType<typeof screen.getAllByAltText>;
    await waitFor(() => {
      displayedTweets = screen.getAllByText(tweetTextFormat, {
        exact: false,
      });
      expect(displayedTweets).toHaveLength(totalTweets);
    });

    displayedTweets!.forEach((element, index) =>
      expect(element.textContent).toBe(mockedTimeline[index].text)
    );
  };

  test("first full page", async () => {
    renderWithOptions(<Home />, {
      withQueryClient: true,
      routeEntries: [getPagePath("home")],
    });
    await testDisplayedTweets({ totalTweets: timelinePageSize });
  });

  test("first page but without enough tweets", async () => {
    server.use(overrideHandlers.timelineWithFewPosts());
    renderWithOptions(<Home />, {
      withQueryClient: true,
      routeEntries: [getPagePath("home")],
    });
    await testDisplayedTweets({ totalTweets: 2 });
  });

  test("first page and scrolling to show second page", async () => {
    let triggerScrollHandler;
    const mockHandler = vi
      .spyOn(useScrollNearBottom, "default")
      .mockImplementation(({ scrollHandler }) => {
        triggerScrollHandler = scrollHandler;
      });

    renderWithOptions(<Home />, {
      withQueryClient: true,
      routeEntries: [getPagePath("home")],
    });
    expect(mockHandler).toHaveBeenCalled();

    await testDisplayedTweets({ totalTweets: timelinePageSize });
    triggerScrollHandler!();
    await testDisplayedTweets({ totalTweets: 2 * timelinePageSize });
  });
});
