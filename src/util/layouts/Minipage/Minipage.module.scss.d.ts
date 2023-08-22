import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Minipage: "Minipage";
  readonly AlignContentWithIcon: "AlignContentWithIcon";
  readonly Content: "Content";
  readonly AlignContentWithHeader: "AlignContentWithHeader";
  readonly Footer: "Footer";
  readonly Wrapper: "Wrapper";
};
export = classNames;
export type ClassNames =
  | "Minipage"
  | "AlignContentWithIcon"
  | "Content"
  | "AlignContentWithHeader"
  | "Footer"
  | "Wrapper"
  | GlobalClassNames;
