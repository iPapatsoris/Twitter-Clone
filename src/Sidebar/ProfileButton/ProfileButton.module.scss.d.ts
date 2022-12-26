import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly ProfileButton: "ProfileButton";
};
export = classNames;
export type ProfileButtonNames = "ProfileButton" | GlobalClassNames;
