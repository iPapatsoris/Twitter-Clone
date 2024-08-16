import { screen, waitFor } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { timelinePageSize } from "../Home";
import { getPagePath } from "../../util/paths";
import { server } from "../../tests/setupTests";
import { tweetTestData } from "../../tests/mocks/handlers/timeline/data";
import { overrideHandlers } from "../../tests/mocks/handlers/timeline";
import * as useScrollNearBottom from "../../util/hooks/useScrollNearBottom";
import { debug } from "vitest-preview";
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
    const { mockHandler: useLoggedInUserMockHandler } = testUtil.renderRouter(
      { path: homePath, options: { initialEntries: [homePath] } },
      {
        isUserLoggedIn: true,
      }
    );
    await waitFor(() => expect(useLoggedInUserMockHandler).toHaveBeenCalled());
  };

  // Variable to store and manually trigger scroll handler passed to useScrollNearBottom
  let triggerScrollHandler;
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
    const mockHandler = mockScrollNearBottom();
    await renderHomeWithRouter();

    // Because we use a route loader that fetches data before the route element
    // renders, it's required to await here instead of just assert.
    await waitFor(() => expect(mockHandler).toHaveBeenCalled());

    await testDisplayedTweets({ totalTweets: timelinePageSize });
    triggerScrollHandler!();
    await testDisplayedTweets({ totalTweets: 2 * timelinePageSize });

    // Treat the third page as the last one
    server.use(overrideHandlers.timelineWithFewPosts(2 * timelinePageSize));

    triggerScrollHandler!();
    await testDisplayedTweets({ totalTweets: 2 * timelinePageSize + 2 });
  });

  test("no fetch is performed when scrolling at the bottom of the last page", async () => {
    const mockHandler = mockScrollNearBottom();
    server.use(overrideHandlers.timelineWithFewPosts());

    await renderHomeWithRouter();
    await waitFor(() => expect(mockHandler).toHaveBeenCalled());
    await testDisplayedTweets({ totalTweets: 2 });

    triggerScrollHandler!();
    await testDisplayedTweets({ totalTweets: 2 });
  });
});
