import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly List: "List";
  readonly BackgroundColor: "BackgroundColor";
  readonly Title: "Title";
};
export = classNames;
export type ClassNames =
  | "List"
  | "BackgroundColor"
  | "Title"
  | GlobalClassNames;
