import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly ProfileButton: "ProfileButton";
  readonly Wrapper: "Wrapper";
  readonly Avatar: "Avatar";
  readonly PopupStyles: "PopupStyles";
};
export = classNames;
export type ClassNames =
  | "ProfileButton"
  | "Wrapper"
  | "Avatar"
  | "PopupStyles"
  | GlobalClassNames;
