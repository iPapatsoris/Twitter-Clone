import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Icon: "Icon";
  readonly NormalSize: "NormalSize";
  readonly LargeSize: "LargeSize";
  readonly LargeSizeLogo: "LargeSizeLogo";
  readonly HoverNone: "HoverNone";
  readonly HoverNormal: "HoverNormal";
  readonly HoverPrimary: "HoverPrimary";
};
export = classNames;
export type IconNames =
  | "Icon"
  | "NormalSize"
  | "LargeSize"
  | "LargeSizeLogo"
  | "HoverNone"
  | "HoverNormal"
  | "HoverPrimary"
  | GlobalClassNames;
