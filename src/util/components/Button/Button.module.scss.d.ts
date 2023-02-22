import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Button: "Button";
  readonly Primary: "Primary";
  readonly Black: "Black";
  readonly White: "White";
  readonly Small: "Small";
  readonly Medium: "Medium";
  readonly Large: "Large";
  readonly Stretch: "Stretch";
  readonly LargeFont: "LargeFont";
  readonly BlackFont: "BlackFont";
};
export = classNames;
export type ButtonNames =
  | "Button"
  | "Primary"
  | "Black"
  | "White"
  | "Small"
  | "Medium"
  | "Large"
  | "Stretch"
  | "LargeFont"
  | "BlackFont"
  | GlobalClassNames;
