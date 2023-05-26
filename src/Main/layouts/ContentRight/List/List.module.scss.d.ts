import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly List: "List";
  readonly BackgroundColor: "BackgroundColor";
  readonly Title: "Title";
  readonly ShowMore: "ShowMore";
};
export = classNames;
export type ListNames =
  | "List"
  | "BackgroundColor"
  | "Title"
  | "ShowMore"
  | GlobalClassNames;
