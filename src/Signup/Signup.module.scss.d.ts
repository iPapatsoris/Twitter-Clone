import globalClassNames, { ClassNames as GlobalClassNames } from "../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Signup: "Signup";
};
export = classNames;
export type SignupNames = "Signup" | GlobalClassNames;
