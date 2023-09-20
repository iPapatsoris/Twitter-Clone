import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly ProfileButton: "ProfileButton";
  readonly PopupStyles: "PopupStyles";
};
export = classNames;
export type ClassNames = "ProfileButton" | "PopupStyles" | GlobalClassNames;
