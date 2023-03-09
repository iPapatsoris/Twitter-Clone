import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly VerifyAccountInfo: "VerifyAccountInfo";
  readonly Terms: "Terms";
};
export = classNames;
export type VerifyAccountInfoNames =
  | "VerifyAccountInfo"
  | "Terms"
  | GlobalClassNames;
