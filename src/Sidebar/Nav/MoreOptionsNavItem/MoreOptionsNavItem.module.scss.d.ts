import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly PopupStyles: "PopupStyles";
};
export = classNames;
export type ClassNames = "PopupStyles" | GlobalClassNames;
