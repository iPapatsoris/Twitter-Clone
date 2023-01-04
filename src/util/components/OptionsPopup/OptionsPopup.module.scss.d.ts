import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly OptionsPopup: "OptionsPopup";
  readonly Option: "Option";
};
export = classNames;
export type OptionsPopupNames = "OptionsPopup" | "Option" | GlobalClassNames;
