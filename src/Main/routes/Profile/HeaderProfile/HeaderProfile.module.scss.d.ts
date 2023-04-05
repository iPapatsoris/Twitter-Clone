import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly HeaderProfile: "HeaderProfile";
  readonly UserInfo: "UserInfo";
};
export = classNames;
export type HeaderProfileNames =
  | "HeaderProfile"
  | "UserInfo"
  | GlobalClassNames;
