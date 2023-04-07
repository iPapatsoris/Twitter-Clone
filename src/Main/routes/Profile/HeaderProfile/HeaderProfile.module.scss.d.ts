import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly HeaderProfile: "HeaderProfile";
  readonly UserInfo: "UserInfo";
  readonly NameAndVerified: "NameAndVerified";
};
export = classNames;
export type HeaderProfileNames =
  | "HeaderProfile"
  | "UserInfo"
  | "NameAndVerified"
  | GlobalClassNames;
