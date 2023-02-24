import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Dummy: "Dummy";
  readonly Wrapper: "Wrapper";
  readonly Modal: "Modal";
  readonly CloseIcon: "CloseIcon";
  readonly Header: "Header";
  readonly Content: "Content";
};
export = classNames;
export type ModalNames =
  | "Dummy"
  | "Wrapper"
  | "Modal"
  | "CloseIcon"
  | "Header"
  | "Content"
  | GlobalClassNames;
