import globalClassNames, { ClassNames as GlobalClassNames } from "../style.d";
declare const classNames: typeof globalClassNames & {
  readonly LoadingSpinner: "LoadingSpinner";
};
export = classNames;
export type ClassNames = "LoadingSpinner" | GlobalClassNames;
