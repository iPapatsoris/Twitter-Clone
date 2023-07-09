import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Header: "Header";
  readonly Text: "Text";
  readonly Action: "Action";
  readonly Icon: "Icon";
};
export = classNames;
export type ClassNames =
  | "Header"
  | "Text"
  | "Action"
  | "Icon"
  | GlobalClassNames;
