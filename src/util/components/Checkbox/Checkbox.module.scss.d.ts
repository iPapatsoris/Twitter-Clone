import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly CheckboxArea: "CheckboxArea";
};
export = classNames;
export type CheckboxNames = "CheckboxArea" | GlobalClassNames;
