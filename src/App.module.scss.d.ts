import globalClassNames, { ClassNames as GlobalClassNames } from "./style.d";
declare const classNames: typeof globalClassNames & {
  readonly App: "App";
  readonly NoHeaderRight: "NoHeaderRight";
  readonly ErrorPage: "ErrorPage";
};
export = classNames;
export type ClassNames =
  | "App"
  | "NoHeaderRight"
  | "ErrorPage"
  | GlobalClassNames;
