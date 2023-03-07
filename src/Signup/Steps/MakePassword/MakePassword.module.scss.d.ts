import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly MakePassword: "MakePassword";
  readonly Info: "Info";
};
export = classNames;
export type MakePasswordNames = "MakePassword" | "Info" | GlobalClassNames;
