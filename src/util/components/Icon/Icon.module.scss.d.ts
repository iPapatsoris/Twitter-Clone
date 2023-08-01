import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly IconAndTextWrapper: "IconAndTextWrapper";
  readonly Text: "Text";
  readonly Hover: "Hover";
  readonly IconWrapper: "IconWrapper";
  readonly Icon: "Icon";
  readonly HoverPrimary: "HoverPrimary";
  readonly HoverGreen: "HoverGreen";
  readonly HoverPink: "HoverPink";
  readonly NoLeftMargin: "NoLeftMargin";
  readonly NoRightMargin: "NoRightMargin";
  readonly NoTopMargin: "NoTopMargin";
  readonly NoBottomMargin: "NoBottomMargin";
  readonly NoHover: "NoHover";
  readonly WithBorder: "WithBorder";
  readonly RefWrapper: "RefWrapper";
  readonly NoCursorPointer: "NoCursorPointer";
};
export = classNames;
export type ClassNames =
  | "IconAndTextWrapper"
  | "Text"
  | "Hover"
  | "IconWrapper"
  | "Icon"
  | "HoverPrimary"
  | "HoverGreen"
  | "HoverPink"
  | "NoLeftMargin"
  | "NoRightMargin"
  | "NoTopMargin"
  | "NoBottomMargin"
  | "NoHover"
  | "WithBorder"
  | "RefWrapper"
  | "NoCursorPointer"
  | GlobalClassNames;
