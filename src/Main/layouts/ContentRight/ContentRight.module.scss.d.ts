import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly ContentRight: "ContentRight";
};
export = classNames;
export type ClassNames = "ContentRight" | GlobalClassNames;
