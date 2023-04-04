import globalClassNames, { ClassNames as GlobalClassNames } from "../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Login: "Login";
};
export = classNames;
export type LoginNames = "Login" | GlobalClassNames;
