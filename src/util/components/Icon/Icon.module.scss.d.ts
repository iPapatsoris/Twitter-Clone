import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Icon: "Icon";
  readonly NoHover: "NoHover";
  readonly Hover: "Hover";
  readonly HoverPrimary: "HoverPrimary";
};
export = classNames;
export type IconNames =
  | "Icon"
  | "NoHover"
  | "Hover"
  | "HoverPrimary"
  | GlobalClassNames;
