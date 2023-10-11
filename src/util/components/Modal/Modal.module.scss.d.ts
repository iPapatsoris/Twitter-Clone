import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Dummy: "Dummy";
  readonly Wrapper: "Wrapper";
  readonly SidePanel: "SidePanel";
  readonly Modal: "Modal";
  readonly Header: "Header";
  readonly Content: "Content";
};
export = classNames;
export type ClassNames =
  | "Dummy"
  | "Wrapper"
  | "SidePanel"
  | "Modal"
  | "Header"
  | "Content"
  | GlobalClassNames;
