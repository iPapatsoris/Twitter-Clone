import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Button: "Button";
};
export = classNames;
export type ClassNames = "Button" | GlobalClassNames;
