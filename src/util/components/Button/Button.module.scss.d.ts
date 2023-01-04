import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Button: "Button";
  readonly Primary: "Primary";
  readonly Black: "Black";
  readonly Small: "Small";
  readonly Medium: "Medium";
  readonly Large: "Large";
  readonly Stretch: "Stretch";
  readonly LargeFont: "LargeFont";
};
export = classNames;
export type ButtonNames =
  | "Button"
  | "Primary"
  | "Black"
  | "Small"
  | "Medium"
  | "Large"
  | "Stretch"
  | "LargeFont"
  | GlobalClassNames;
