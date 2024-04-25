import globalClassNames from "../style.d";
declare const classNames: typeof globalClassNames & {
  readonly LoadingSpinner: "LoadingSpinner";
  readonly ExpandUpTimelineButton: "ExpandUpTimelineButton";
};
export = classNames;
