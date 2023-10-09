import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Minipage: "Minipage";
  readonly Footer: "Footer";
  readonly AlignContentWithIcon: "AlignContentWithIcon";
  readonly Content: "Content";
  readonly AlignContentWithHeader: "AlignContentWithHeader";
  readonly Wrapper: "Wrapper";
};
export = classNames;
export type ClassNames =
  | "Minipage"
  | "Footer"
  | "AlignContentWithIcon"
  | "Content"
  | "AlignContentWithHeader"
  | "Wrapper"
  | GlobalClassNames;
