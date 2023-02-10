import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Center: "Center";
  readonly Modal: "Modal";
  readonly CloseIcon: "CloseIcon";
  readonly Header: "Header";
  readonly Content: "Content";
};
export = classNames;
export type ModalNames =
  | "Center"
  | "Modal"
  | "CloseIcon"
  | "Header"
  | "Content"
  | GlobalClassNames;
