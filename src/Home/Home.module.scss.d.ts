import globalClassNames, { ClassNames as GlobalClassNames } from "../style.d";
declare const classNames: typeof globalClassNames & {
  readonly LoadingSpinner: "LoadingSpinner";
  readonly ExpandUpTimelineButton: "ExpandUpTimelineButton";
};
export = classNames;
export type ClassNames =
  | "LoadingSpinner"
  | "ExpandUpTimelineButton"
  | GlobalClassNames;
