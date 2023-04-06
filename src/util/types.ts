import { LoaderFunction } from "react-router-dom";

export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

/**
 * To achieve type safety for the result of react-router-dom::useLoader(), as it
 * is not natively supported by the library. Source:
 * https://github.com/remix-run/react-router/discussions/9792#discussioncomment-4809811
 */
export type LoaderData<TLoaderFn extends LoaderFunction> = Awaited<
  ReturnType<TLoaderFn>
> extends Response | infer D
  ? D
  : never;
