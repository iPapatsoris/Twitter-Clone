import { setupServer } from "msw/node";
import { handlers } from "./handlers";
import { afterAll, beforeAll, beforeEach, onTestFailed } from "vitest";
import { cleanup } from "@testing-library/react";
import { debug } from "vitest-preview";

export const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());

beforeEach(() => {
  /* 
    Cleanup previous test. We don't do it on `afterEach`, because it would clear
    the state before `onTestFailed` would run, thus vitest-preview would not 
    print the DOM at the error state. 
  */
  cleanup();
  onTestFailed(() => {
    debug();
  });
});
