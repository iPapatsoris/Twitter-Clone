import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Wrapper: "Wrapper";
  readonly Value: "Value";
  readonly Popup: "Popup";
  readonly Option: "Option";
};
export = classNames;
export type DropdownNames =
  | "Wrapper"
  | "Value"
  | "Popup"
  | "Option"
  | GlobalClassNames;
