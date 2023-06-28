import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly ErrorPage: "ErrorPage";
};
export = classNames;
export type ClassNames = "ErrorPage" | GlobalClassNames;
