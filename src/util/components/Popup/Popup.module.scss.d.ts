import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Popup: "Popup";
};
export = classNames;
export type PopupNames = "Popup" | GlobalClassNames;
