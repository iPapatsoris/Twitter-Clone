import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Icon: "Icon";
  readonly NormalSize: "NormalSize";
  readonly LargeSize: "LargeSize";
  readonly LargeSizeMoreOption: "LargeSizeMoreOption";
  readonly LargeSizeLogo: "LargeSizeLogo";
  readonly TinySizeLogo: "TinySizeLogo";
  readonly HoverNone: "HoverNone";
  readonly HoverNormal: "HoverNormal";
  readonly HoverPrimary: "HoverPrimary";
};
export = classNames;
export type IconNames =
  | "Icon"
  | "NormalSize"
  | "LargeSize"
  | "LargeSizeMoreOption"
  | "LargeSizeLogo"
  | "TinySizeLogo"
  | "HoverNone"
  | "HoverNormal"
  | "HoverPrimary"
  | GlobalClassNames;
