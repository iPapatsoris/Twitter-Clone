import globalClassNames, { ClassNames as GlobalClassNames } from "./style.d";
declare const classNames: typeof globalClassNames & {
  readonly App: "App";
  readonly NoHeaderRight: "NoHeaderRight";
};
export = classNames;
export type ClassNames = "App" | "NoHeaderRight" | GlobalClassNames;
