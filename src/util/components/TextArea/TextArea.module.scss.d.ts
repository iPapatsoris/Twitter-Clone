import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly TextArea: "TextArea";
};
export = classNames;
export type ClassNames = "TextArea" | GlobalClassNames;
