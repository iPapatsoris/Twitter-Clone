import globalClassNames, { ClassNames as GlobalClassNames } from "../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Signup: "Signup";
  readonly NameEmail: "NameEmail";
  readonly DateOfBirth: "DateOfBirth";
  readonly Form: "Form";
  readonly Dropdowns: "Dropdowns";
  readonly Dropdown: "Dropdown";
  readonly Button: "Button";
};
export = classNames;
export type SignupNames =
  | "Signup"
  | "NameEmail"
  | "DateOfBirth"
  | "Form"
  | "Dropdowns"
  | "Dropdown"
  | "Button"
  | GlobalClassNames;
