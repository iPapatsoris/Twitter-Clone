import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Minipage: "Minipage";
  readonly AlignHeaderWithContent: "AlignHeaderWithContent";
  readonly Content: "Content";
  readonly Footer: "Footer";
  readonly Wrapper: "Wrapper";
};
export = classNames;
export type ClassNames =
  | "Minipage"
  | "AlignHeaderWithContent"
  | "Content"
  | "Footer"
  | "Wrapper"
  | GlobalClassNames;
