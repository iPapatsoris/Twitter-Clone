import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly AccountInfo: "AccountInfo";
  readonly NameEmail: "NameEmail";
  readonly DateOfBirth: "DateOfBirth";
  readonly Form: "Form";
  readonly Dropdowns: "Dropdowns";
  readonly Dropdown: "Dropdown";
  readonly Button: "Button";
};
export = classNames;
export type AccountInfoNames =
  | "AccountInfo"
  | "NameEmail"
  | "DateOfBirth"
  | "Form"
  | "Dropdowns"
  | "Dropdown"
  | "Button"
  | GlobalClassNames;
