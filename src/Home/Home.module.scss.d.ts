import globalClassNames from "../assets/styles/common.d";
declare const classNames: typeof globalClassNames & {
  readonly LoadingSpinner: "LoadingSpinner";
  readonly ExpandUpTimelineButton: "ExpandUpTimelineButton";
};
export = classNames;
