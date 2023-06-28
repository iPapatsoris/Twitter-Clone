import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Dropdowns: "Dropdowns";
  readonly Dropdown: "Dropdown";
};
export = classNames;
export type ClassNames = "Dropdowns" | "Dropdown" | GlobalClassNames;
