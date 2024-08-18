import { screen, waitFor } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { timelinePageSize } from "../Home";
import { getPagePath } from "../../util/paths";
import { server } from "../../tests/setupTests";
import { tweetTestData } from "../../tests/mocks/handlers/timeline/data";
import {
  downTimelineQuerySpy,
  overrideHandlers,
} from "../../tests/mocks/handlers/timeline";
import * as useScrollNearBottom from "../../util/hooks/useScrollNearBottom";
import testUtil from "../../tests/util";

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

  const renderHomeWithRouter = async () => {
    const homePath = getPagePath("home");
    const { mockUseLoggedInUser } = testUtil.renderRouter(
      { path: homePath, options: { initialEntries: [homePath] } },
      {
        isUserLoggedIn: true,
      }
    );
    // Because we use a route loader that fetches data before the route element
    // renders, it's required to await here instead of just assert.
    await waitFor(() => expect(mockUseLoggedInUser).toHaveBeenCalled());
  };

  // Variable to store and manually trigger scroll handler passed to useScrollNearBottom
  let triggerScrollHandler: VoidFunction;
  const mockScrollNearBottom = () =>
    vi
      .spyOn(useScrollNearBottom, "default")
      .mockImplementation(({ scrollHandler }) => {
        triggerScrollHandler = scrollHandler;
      });

  test("first full page", async () => {
    await renderHomeWithRouter();
    await testDisplayedTweets({ totalTweets: timelinePageSize });
  });

  test("first page is the last page", async () => {
    server.use(overrideHandlers.timelineWithFewPosts());
    await renderHomeWithRouter();
    await testDisplayedTweets({ totalTweets: 2 });
  });

  test("first page and scrolling to show second and third pages", async () => {
    const mockScroll = mockScrollNearBottom();
    await renderHomeWithRouter();
    await waitFor(() => expect(mockScroll).toHaveBeenCalled());

    // Check first page
    await testDisplayedTweets({ totalTweets: timelinePageSize });

    triggerScrollHandler();

    // Check second page
    await testDisplayedTweets({ totalTweets: 2 * timelinePageSize });

    // Treat the third page as the last one
    server.use(overrideHandlers.timelineWithFewPosts(2 * timelinePageSize));

    triggerScrollHandler();

    // Check third page
    await testDisplayedTweets({ totalTweets: 2 * timelinePageSize + 2 });
  });

  test("no fetch is performed when scrolling at the bottom of the last page", async () => {
    const mockScroll = mockScrollNearBottom();

    // Treat the first page as the last one
    server.use(overrideHandlers.timelineWithFewPosts());

    await renderHomeWithRouter();
    await waitFor(() => expect(mockScroll).toHaveBeenCalled());

    // Check first page
    await testDisplayedTweets({ totalTweets: 2 });

    triggerScrollHandler();

    // Check that no more tweets are accidentally loaded
    await testDisplayedTweets({ totalTweets: 2 });
  });

  test(
    "cache is properly utilized in place of network calls when coming back to the timeline",
    { timeout: 10000 },
    async () => {
      const homePath = getPagePath("home");
      const mockScroll = mockScrollNearBottom();

      // Render Home with the whole router context
      const { mockUseLoggedInUser, user } = testUtil.renderRouter(
        {
          path: homePath,
          parentRoutesToRender: 1,
          options: { initialEntries: [homePath] },
        },
        {
          isUserLoggedIn: true,
          mockLayoutMethods: true,
          withUserEvents: true,
        }
      );
      await waitFor(() => expect(mockUseLoggedInUser).toHaveBeenCalled());
      await waitFor(() => expect(mockScroll).toHaveBeenCalled());
      await testDisplayedTweets({ totalTweets: 10 });

      // Load second page
      triggerScrollHandler();
      await testDisplayedTweets({ totalTweets: 20 });
      expect(downTimelineQuerySpy).toHaveBeenCalledTimes(2);
      downTimelineQuerySpy.mockClear();

      // Switch to another route and return to Home
      const changeRouteAndReturn = () => {
        const explorePage = screen.getByRole("link", { name: "Explore" });
        user?.click(explorePage);
        const homePage = screen.getByRole("link", { name: "Home" });
        user?.click(homePage);
      };

      changeRouteAndReturn();

      // Check that first page is loaded from the cache without network calls
      await testDisplayedTweets({ totalTweets: 10 });
      expect(downTimelineQuerySpy).not.toHaveBeenCalled();

      triggerScrollHandler();

      // Check that second page is loaded from the cache without network calls
      await testDisplayedTweets({ totalTweets: 20 });
      expect(downTimelineQuerySpy).not.toHaveBeenCalled();

      triggerScrollHandler();

      // Check that third page is loaded from the network
      await testDisplayedTweets({ totalTweets: 30 });
      expect(downTimelineQuerySpy).toHaveBeenCalled();
      downTimelineQuerySpy.mockClear();

      changeRouteAndReturn();

      // Check that first three pages are loaded from the cache
      await testDisplayedTweets({ totalTweets: 10 });
      triggerScrollHandler();
      await testDisplayedTweets({ totalTweets: 20 });
      triggerScrollHandler();
      await testDisplayedTweets({ totalTweets: 30 });
      expect(downTimelineQuerySpy).not.toHaveBeenCalled();

      // Check that fourth and fifth pages are loaded from the network
      triggerScrollHandler();
      await testDisplayedTweets({ totalTweets: 40 });
      triggerScrollHandler();
      await testDisplayedTweets({ totalTweets: 50 });
      expect(downTimelineQuerySpy).toHaveBeenCalledTimes(2);
    }
  );
});
