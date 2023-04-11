import { LoaderFunction, LoaderFunctionArgs } from "react-router-dom";

export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

/**
 * Type to achieve type safety for the result of react-router-dom::useLoader(),
 * as it is not natively supported by the library. Modified to support passing
 * extra argument to loader. Source of original type:
 * https://github.com/remix-run/react-router/discussions/9792#discussioncomment-4809811
 */

export type LoaderData<
  TLoaderFn extends LoaderFunctionWithExtra<Extra>,
  Extra = null
> = Awaited<ReturnType<TLoaderFn>> extends Response | infer D ? D : never;

export type LoaderFunctionWithExtra<Extra> = (
  args: LoaderFunctionArgs,
  extra: Extra
) => ReturnType<LoaderFunction>;
