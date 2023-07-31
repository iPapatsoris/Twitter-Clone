import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly IconAndTextWrapper: "IconAndTextWrapper";
  readonly Text: "Text";
  readonly Hover: "Hover";
  readonly IconWrapper: "IconWrapper";
  readonly HoverPrimary: "HoverPrimary";
  readonly HoverGreen: "HoverGreen";
  readonly HoverPink: "HoverPink";
  readonly ExactLeftPlacement: "ExactLeftPlacement";
  readonly ExactRightPlacement: "ExactRightPlacement";
  readonly ExactTopPlacement: "ExactTopPlacement";
  readonly ExactBottomPlacement: "ExactBottomPlacement";
  readonly NoHover: "NoHover";
  readonly WithBorder: "WithBorder";
  readonly Icon: "Icon";
  readonly NoCursorPointer: "NoCursorPointer";
};
export = classNames;
export type ClassNames =
  | "IconAndTextWrapper"
  | "Text"
  | "Hover"
  | "IconWrapper"
  | "HoverPrimary"
  | "HoverGreen"
  | "HoverPink"
  | "ExactLeftPlacement"
  | "ExactRightPlacement"
  | "ExactTopPlacement"
  | "ExactBottomPlacement"
  | "NoHover"
  | "WithBorder"
  | "Icon"
  | "NoCursorPointer"
  | GlobalClassNames;
