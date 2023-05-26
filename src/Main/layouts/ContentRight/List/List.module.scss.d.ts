import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly List: "List";
  readonly BackgroundColor: "BackgroundColor";
  readonly ShowMore: "ShowMore";
};
export = classNames;
export type ListNames =
  | "List"
  | "BackgroundColor"
  | "ShowMore"
  | GlobalClassNames;
