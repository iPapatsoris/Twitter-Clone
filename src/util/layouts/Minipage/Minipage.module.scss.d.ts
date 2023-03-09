import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Minipage: "Minipage";
  readonly Header: "Header";
  readonly Content: "Content";
  readonly Wrapper: "Wrapper";
  readonly Footer: "Footer";
};
export = classNames;
export type MinipageNames =
  | "Minipage"
  | "Header"
  | "Content"
  | "Wrapper"
  | "Footer"
  | GlobalClassNames;
