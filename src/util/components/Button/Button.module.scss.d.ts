import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Button: "Button";
  readonly Primary: "Primary";
  readonly Black: "Black";
  readonly Disabled: "Disabled";
  readonly White: "White";
  readonly Red: "Red";
  readonly HoverRed: "HoverRed";
  readonly Small: "Small";
  readonly Medium: "Medium";
  readonly Large: "Large";
  readonly Stretch: "Stretch";
  readonly LargeFont: "LargeFont";
};
export = classNames;
export type ClassNames =
  | "Button"
  | "Primary"
  | "Black"
  | "Disabled"
  | "White"
  | "Red"
  | "HoverRed"
  | "Small"
  | "Medium"
  | "Large"
  | "Stretch"
  | "LargeFont"
  | GlobalClassNames;
