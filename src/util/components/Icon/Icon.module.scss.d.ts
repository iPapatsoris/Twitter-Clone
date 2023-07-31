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
  readonly NoLeftMargin: "NoLeftMargin";
  readonly NoRightMargin: "NoRightMargin";
  readonly NoTopMargin: "NoTopMargin";
  readonly NoBottomMargin: "NoBottomMargin";
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
  | "NoLeftMargin"
  | "NoRightMargin"
  | "NoTopMargin"
  | "NoBottomMargin"
  | "NoHover"
  | "WithBorder"
  | "Icon"
  | "NoCursorPointer"
  | GlobalClassNames;
