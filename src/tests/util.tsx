import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  createMemoryRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";

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

const testUtil = { createQueryClient, renderWithOptions };
export default testUtil;
