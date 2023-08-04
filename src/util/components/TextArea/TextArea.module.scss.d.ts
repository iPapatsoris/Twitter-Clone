import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly TextArea: "TextArea";
  readonly Dummy: "Dummy";
};
export = classNames;
export type ClassNames = "TextArea" | "Dummy" | GlobalClassNames;
