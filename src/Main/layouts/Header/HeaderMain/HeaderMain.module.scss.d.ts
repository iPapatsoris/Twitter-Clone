import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly HeaderMain: "HeaderMain";
  readonly HeaderExtendedGridArea: "HeaderExtendedGridArea";
  readonly Main: "Main";
  readonly TitleSubtitle: "TitleSubtitle";
  readonly Title: "Title";
  readonly SearchContainer: "SearchContainer";
};
export = classNames;
export type ClassNames =
  | "HeaderMain"
  | "HeaderExtendedGridArea"
  | "Main"
  | "TitleSubtitle"
  | "Title"
  | "SearchContainer"
  | GlobalClassNames;
