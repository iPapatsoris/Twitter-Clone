import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Minipage: "Minipage";
  readonly Content: "Content";
  readonly Footer: "Footer";
  readonly Wrapper: "Wrapper";
};
export = classNames;
export type MinipageNames =
  | "Minipage"
  | "Content"
  | "Footer"
  | "Wrapper"
  | GlobalClassNames;
