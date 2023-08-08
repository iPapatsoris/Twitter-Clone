import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Welcome: "Welcome";
  readonly Logo: "Logo";
  readonly Title: "Title";
  readonly Join: "Join";
  readonly JoinWrapper: "JoinWrapper";
  readonly Terms: "Terms";
  readonly AlreadyAccount: "AlreadyAccount";
  readonly Button: "Button";
};
export = classNames;
export type ClassNames =
  | "Welcome"
  | "Logo"
  | "Title"
  | "Join"
  | "JoinWrapper"
  | "Terms"
  | "AlreadyAccount"
  | "Button"
  | GlobalClassNames;
