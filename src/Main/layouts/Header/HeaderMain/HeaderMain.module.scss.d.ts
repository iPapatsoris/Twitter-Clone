import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly HeaderMain: "HeaderMain";
  readonly Main: "Main";
  readonly TitleSubtitle: "TitleSubtitle";
  readonly Title: "Title";
  readonly HeaderMainGridArea: "HeaderMainGridArea";
  readonly HeaderExtendedGridArea: "HeaderExtendedGridArea";
  readonly SearchContainer: "SearchContainer";
};
export = classNames;
export type ClassNames =
  | "HeaderMain"
  | "Main"
  | "TitleSubtitle"
  | "Title"
  | "HeaderMainGridArea"
  | "HeaderExtendedGridArea"
  | "SearchContainer"
  | GlobalClassNames;
