import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly AccountInfo: "AccountInfo";
  readonly NameEmail: "NameEmail";
  readonly DateOfBirth: "DateOfBirth";
  readonly Form: "Form";
};
export = classNames;
export type ClassNames =
  | "AccountInfo"
  | "NameEmail"
  | "DateOfBirth"
  | "Form"
  | GlobalClassNames;
