import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import Home, { timelinePageSize } from "../Home";
import {
  createMemoryRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import { getPagePath } from "../../util/paths";
import { server } from "../../mocks/setupTests";
import { tweetTestData } from "../../mocks/handlers/timeline/data";
import { overrideHandlers } from "../../mocks/handlers/timeline";
import userEvent from "@testing-library/user-event";
import * as useScrollNearBottom from "../../util/hooks/useScrollNearBottom";
import { debug } from "vitest-preview";
import { homeLoader } from "../queries";

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

const renderWithOptions = (
  component: JSX.Element,
  options: {
    queryClient?: QueryClient;
    withUserEvents?: boolean;
    router?: {
      initialEntries?: string[];
      routes: RouteObject[];
    };
  }
) => {
  const { queryClient, withUserEvents, router } = options;
  let wrappedComponent = component;

  if (router) {
    wrappedComponent = (
      <RouterProvider
        router={createMemoryRouter(router.routes, {
          initialEntries: router.initialEntries,
        })}
      />
    );
  }
  wrappedComponent = (
    <QueryClientProvider client={queryClient ?? createQueryClient()}>
      {wrappedComponent}
    </QueryClientProvider>
  );

  return {
    user: withUserEvents ? userEvent.setup() : undefined,
    queryClient: queryClient,
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

  const renderHomeWithRouter = () => {
    const queryClient = createQueryClient();
    return renderWithOptions(<></>, {
      queryClient,
      router: {
        initialEntries: [getPagePath("home")],
        routes: [
          {
            element: <Home />,
            path: getPagePath("home"),
            loader: homeLoader(queryClient),
          },
        ],
      },
    });
  };

  let triggerScrollHandler;
  const mockScrollNearBottom = () =>
    vi
      .spyOn(useScrollNearBottom, "default")
      .mockImplementation(({ scrollHandler }) => {
        triggerScrollHandler = scrollHandler;
      });

  test("first full page", async () => {
    renderHomeWithRouter();
    await testDisplayedTweets({ totalTweets: timelinePageSize });
  });

  test("first page but without enough tweets", async () => {
    server.use(overrideHandlers.timelineWithFewPosts());
    renderHomeWithRouter();
    await testDisplayedTweets({ totalTweets: 2 });
  });

  test("first page and scrolling to show second page", async () => {
    const mockHandler = mockScrollNearBottom();
    renderHomeWithRouter();

    // Because we use a route loader that fetches data before the route element
    // renders, it's required to await here instead of just assert.
    await waitFor(() => expect(mockHandler).toHaveBeenCalled());

    await testDisplayedTweets({ totalTweets: timelinePageSize });
    triggerScrollHandler!();
    await testDisplayedTweets({ totalTweets: 2 * timelinePageSize });
  });

  test("no fetch is performed when scrolling at the bottom of the last page", async () => {
    const mockHandler = mockScrollNearBottom();
    server.use(overrideHandlers.timelineWithFewPosts());

    renderHomeWithRouter();
    await waitFor(() => expect(mockHandler).toHaveBeenCalled());
    await testDisplayedTweets({ totalTweets: 2 });

    triggerScrollHandler!();
    await testDisplayedTweets({ totalTweets: 2 });
    debug();
  });
});
