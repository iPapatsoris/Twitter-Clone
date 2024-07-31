import {
  render,
  screen,
  fireEvent,
  RenderResult,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { test } from "vitest";
import Home from "../Home";

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
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    options
  );
};

test("Timeline", () => {
  renderWithClient(<Home />);
});
