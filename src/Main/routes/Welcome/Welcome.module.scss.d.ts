import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Welcome: "Welcome";
  readonly Title: "Title";
  readonly Join: "Join";
  readonly Logo: "Logo";
  readonly JoinWrapper: "JoinWrapper";
  readonly Terms: "Terms";
  readonly AlreadyAccount: "AlreadyAccount";
  readonly Button: "Button";
};
export = classNames;
export type ClassNames =
  | "Welcome"
  | "Title"
  | "Join"
  | "Logo"
  | "JoinWrapper"
  | "Terms"
  | "AlreadyAccount"
  | "Button"
  | GlobalClassNames;
