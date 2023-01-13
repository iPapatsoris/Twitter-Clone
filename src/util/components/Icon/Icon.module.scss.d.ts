import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly IconWrapper: "IconWrapper";
  readonly Hover: "Hover";
  readonly HoverPrimary: "HoverPrimary";
  readonly NoHover: "NoHover";
  readonly Icon: "Icon";
};
export = classNames;
export type IconNames =
  | "IconWrapper"
  | "Hover"
  | "HoverPrimary"
  | "NoHover"
  | "Icon"
  | GlobalClassNames;
