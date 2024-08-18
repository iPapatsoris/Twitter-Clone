import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  createMemoryRouter,
  matchRoutes,
  RouterProvider,
} from "react-router-dom";
import { vi, expect } from "vitest";
import * as authStore from "../store/AuthStore";
import { getRoutes } from "../Router";
import userTestData from "../tests/mocks/handlers/user/data";
import * as useDynamicSticky from "../util/hooks/useDynamicSticky";
import * as useWindowDimensions from "../util/hooks/useWindowDimensions";

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

type CommonOptions = {
  withUserEvents?: boolean;
  mockLayoutMethods?: boolean;
};

/* 
  Match a route path to the app router and render the appropriate components.
  Can choose how many parent routes of a deeply nested child route match should 
  be rendered, depending on the integration scope of each use case.
  Additionally specify extra setup options like mocking logged in user and 
  whether to enable React Testing Library user events.
*/
const renderRouter = (
  router: {
    path: string;
    options?: Parameters<typeof createMemoryRouter>[1];
    // Control how many parent route matches get rendered, starting from the
    // deepest child. Defaults to 0.
    parentRoutesToRender?: number;
  },
  options: CommonOptions & {
    isUserLoggedIn: boolean;
  }
) => {
  const { isUserLoggedIn, ...restOptions } = options;
  const queryClient = createQueryClient();

  // Get all routes, controlling if the user is logged in or not
  const routes = getRoutes({
    loggedInUser: options.isUserLoggedIn
      ? userTestData.loggedInUser
      : undefined,
    justSignedUp: false,
    queryClient,
  });

  // Match given path to the correct routes
  const matchedRoutes = matchRoutes(routes, router.path);

  const parentRoutesToRender = router.parentRoutesToRender ?? 0;
  expect(
    parentRoutesToRender >= 0 && parentRoutesToRender < matchedRoutes!.length
  ).toBeTruthy();

  /*
    The matching algorithm first returns the route that matches the earliest
    portion of the URL (including its children), and subsequent elements in the 
    array represent progressively deeper and more specific matches among its 
    children. We default to the deepest isolated child match, and include parent 
    matches depending on `parentRoutesToRender`. 
  */
  const routesToRender = [
    matchedRoutes![matchedRoutes!.length - 1 - parentRoutesToRender].route,
  ];

  const component = (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={createMemoryRouter(routesToRender, router.options)}
      />
    </QueryClientProvider>
  );

  return renderComponent(component, {
    ...restOptions,
    mockLoggedInUser: { isUserLoggedIn },
  });
};

// Render a component with extra setup options depending on each test's needs
const renderComponent = (
  component: JSX.Element,
  options: CommonOptions & {
    withQueryClient?: boolean;
    mockLoggedInUser?: {
      isUserLoggedIn: boolean;
    };
  }
) => {
  const {
    withQueryClient,
    withUserEvents,
    mockLayoutMethods,
    mockLoggedInUser,
  } = options;
  let wrappedComponent = component;
  let queryClient;

  if (withQueryClient) {
    queryClient = createQueryClient();
    wrappedComponent = (
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  }

  let mockUseLoggedInUser;
  if (mockLoggedInUser) {
    mockUseLoggedInUser = vi
      .spyOn(authStore, "useLoggedInUser")
      .mockImplementation(() => userTestData.loggedInUser);
  }

  if (mockLayoutMethods) {
    window.scrollTo = vi.fn();
    vi.spyOn(useDynamicSticky, "default").mockImplementation(() => {});
    vi.spyOn(useWindowDimensions, "default").mockImplementation(() => ({
      isMobile: false,
      isPcBig: true,
      isPcSmall: false,
      isSmallScreen: false,
      isTablet: false,
      width: 0,
      height: 0,
    }));
  }

  return {
    user: withUserEvents ? userEvent.setup() : undefined,
    queryClient,
    mockUseLoggedInUser,
    ...render(wrappedComponent),
  };
};

const testUtil = { createQueryClient, renderComponent, renderRouter };
export default testUtil;
