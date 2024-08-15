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

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

/* 
  Match a route path to the app router and render the appropriate components.
  Can choose how many parent routes of a child route match should be rendered,
  depending on the integration scope of each use case.
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
  options: {
    isUserLoggedIn: boolean;
    withUserEvents?: boolean;
  }
) => {
  const { isUserLoggedIn, withUserEvents } = options;
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
  );

  // Choose how many parent routes will be included
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
    withUserEvents,
    mockLoggedInUser: { isUserLoggedIn },
  });
};

// Render a component with extra setup options depending on each test's needs
const renderComponent = (
  component: JSX.Element,
  options: {
    withQueryClient?: boolean;
    withUserEvents?: boolean;
    mockLoggedInUser?: {
      isUserLoggedIn: boolean;
    };
  }
) => {
  const { withQueryClient, withUserEvents, mockLoggedInUser } = options;
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

  let mockHandler;
  if (mockLoggedInUser) {
    mockHandler = vi
      .spyOn(authStore, "useLoggedInUser")
      .mockImplementation(() => userTestData.loggedInUser);
  }

  return {
    user: withUserEvents ? userEvent.setup() : undefined,
    queryClient: queryClient,
    mockHandler,
    ...render(wrappedComponent),
  };
};

const testUtil = { createQueryClient, renderComponent, renderRouter };
export default testUtil;
