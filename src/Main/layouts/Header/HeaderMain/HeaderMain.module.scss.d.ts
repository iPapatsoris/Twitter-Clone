import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly HeaderMain: "HeaderMain";
  readonly HeaderMainGridArea: "HeaderMainGridArea";
};
export = classNames;
export type HeaderMainNames =
  | "HeaderMain"
  | "HeaderMainGridArea"
  | GlobalClassNames;
