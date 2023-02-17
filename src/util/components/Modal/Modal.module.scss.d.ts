import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Modal: "Modal";
  readonly Wrapper: "Wrapper";
  readonly CloseIcon: "CloseIcon";
  readonly Header: "Header";
  readonly Content: "Content";
};
export = classNames;
export type ModalNames =
  | "Modal"
  | "Wrapper"
  | "CloseIcon"
  | "Header"
  | "Content"
  | GlobalClassNames;
