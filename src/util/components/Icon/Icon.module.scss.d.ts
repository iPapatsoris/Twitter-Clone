import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly IconWrapper: "IconWrapper";
  readonly ExactHorizontalPlacement: "ExactHorizontalPlacement";
  readonly ExactVerticalPlacement: "ExactVerticalPlacement";
  readonly Hover: "Hover";
  readonly HoverPrimary: "HoverPrimary";
  readonly NoHover: "NoHover";
  readonly Icon: "Icon";
  readonly WithBorder: "WithBorder";
};
export = classNames;
export type IconNames =
  | "IconWrapper"
  | "ExactHorizontalPlacement"
  | "ExactVerticalPlacement"
  | "Hover"
  | "HoverPrimary"
  | "NoHover"
  | "Icon"
  | "WithBorder"
  | GlobalClassNames;
