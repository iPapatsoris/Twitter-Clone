import globalClassNames, { ClassNames as GlobalClassNames } from "../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Signup: "Signup";
  readonly Content: "Content";
};
export = classNames;
export type SignupNames = "Signup" | "Content" | GlobalClassNames;
