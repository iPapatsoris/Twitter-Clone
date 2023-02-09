import globalClassNames, { ClassNames as GlobalClassNames } from "../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Center: "Center";
  readonly Signup: "Signup";
  readonly Header: "Header";
  readonly NameEmail: "NameEmail";
  readonly DateOfBirth: "DateOfBirth";
  readonly Form: "Form";
  readonly Button: "Button";
};
export = classNames;
export type SignupNames =
  | "Center"
  | "Signup"
  | "Header"
  | "NameEmail"
  | "DateOfBirth"
  | "Form"
  | "Button"
  | GlobalClassNames;
