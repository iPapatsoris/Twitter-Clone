import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly MakeUsername: "MakeUsername";
  readonly Info: "Info";
};
export = classNames;
export type MakeUsernameNames = "MakeUsername" | "Info" | GlobalClassNames;
