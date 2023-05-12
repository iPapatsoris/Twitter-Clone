import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Popup: "Popup";
  readonly NoWrapper: "NoWrapper";
};
export = classNames;
export type PopupNames = "Popup" | "NoWrapper" | GlobalClassNames;
