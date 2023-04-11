import globalClassNames, { ClassNames as GlobalClassNames } from "../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Wrapper: "Wrapper";
  readonly Login: "Login";
};
export = classNames;
export type LoginNames = "Wrapper" | "Login" | GlobalClassNames;
