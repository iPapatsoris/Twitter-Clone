import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Dummy: "Dummy";
  readonly Wrapper: "Wrapper";
  readonly Modal: "Modal";
  readonly WithCloseIcon: "WithCloseIcon";
  readonly CloseIcon: "CloseIcon";
  readonly Header: "Header";
  readonly Content: "Content";
};
export = classNames;
export type ClassNames =
  | "Dummy"
  | "Wrapper"
  | "Modal"
  | "WithCloseIcon"
  | "CloseIcon"
  | "Header"
  | "Content"
  | GlobalClassNames;
