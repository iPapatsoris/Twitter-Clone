import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Dropdown: "Dropdown";
};
export = classNames;
export type DropdownNames = "Dropdown" | GlobalClassNames;
