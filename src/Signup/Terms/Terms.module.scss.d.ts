import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Terms: "Terms";
};
export = classNames;
export type ClassNames = "Terms" | GlobalClassNames;
