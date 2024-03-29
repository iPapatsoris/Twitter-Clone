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
  readonly Name: "Name";
  readonly Subtitle: "Subtitle";
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
  | "Name"
  | "Subtitle"
  | "SearchContainer"
  | GlobalClassNames;
