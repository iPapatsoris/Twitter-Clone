import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly HeaderMain: "HeaderMain";
  readonly HeaderExtendedGridArea: "HeaderExtendedGridArea";
  readonly Border: "Border";
  readonly Main: "Main";
  readonly TitleSubtitle: "TitleSubtitle";
  readonly Title: "Title";
  readonly SearchContainer: "SearchContainer";
};
export = classNames;
export type ClassNames =
  | "HeaderMain"
  | "HeaderExtendedGridArea"
  | "Border"
  | "Main"
  | "TitleSubtitle"
  | "Title"
  | "SearchContainer"
  | GlobalClassNames;
