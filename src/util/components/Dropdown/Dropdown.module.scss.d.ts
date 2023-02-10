import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Wrapper: "Wrapper";
  readonly Value: "Value";
};
export = classNames;
export type DropdownNames = "Wrapper" | "Value" | GlobalClassNames;
