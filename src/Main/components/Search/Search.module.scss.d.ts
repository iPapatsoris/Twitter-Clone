import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Search: "Search";
};
export = classNames;
export type ClassNames = "Search" | GlobalClassNames;
