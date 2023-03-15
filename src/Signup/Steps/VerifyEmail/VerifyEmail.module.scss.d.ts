import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly VerifyEmail: "VerifyEmail";
  readonly Info: "Info";
  readonly Hint: "Hint";
};
export = classNames;
export type VerifyEmailNames =
  | "VerifyEmail"
  | "Info"
  | "Hint"
  | GlobalClassNames;
