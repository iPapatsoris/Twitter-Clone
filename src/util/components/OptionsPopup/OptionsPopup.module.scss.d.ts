import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly OptionsPopup: "OptionsPopup";
  readonly Option: "Option";
  readonly Icon: "Icon";
  readonly RotateIcon: "RotateIcon";
};
export = classNames;
export type OptionsPopupNames =
  | "OptionsPopup"
  | "Option"
  | "Icon"
  | "RotateIcon"
  | GlobalClassNames;
