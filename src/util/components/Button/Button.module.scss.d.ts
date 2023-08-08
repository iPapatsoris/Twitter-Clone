import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Button: "Button";
  readonly Primary: "Primary";
  readonly Disabled: "Disabled";
  readonly Black: "Black";
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
  | "Disabled"
  | "Black"
  | "White"
  | "Red"
  | "HoverRed"
  | "Small"
  | "Medium"
  | "Large"
  | "Stretch"
  | "LargeFont"
  | GlobalClassNames;
