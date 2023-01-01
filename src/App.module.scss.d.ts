import globalClassNames, { ClassNames as GlobalClassNames } from "./style.d";
declare const classNames: typeof globalClassNames & {
  readonly App: "App";
  readonly NoHeaderRight: "NoHeaderRight";
  readonly ExtendedHeaderMain: "ExtendedHeaderMain";
  readonly ErrorPage: "ErrorPage";
};
export = classNames;
export type AppNames =
  | "App"
  | "NoHeaderRight"
  | "ExtendedHeaderMain"
  | "ErrorPage"
  | GlobalClassNames;
