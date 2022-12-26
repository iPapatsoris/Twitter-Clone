import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly ContentMain: "ContentMain";
  readonly ErrorPage: "ErrorPage";
};
export = classNames;
export type MainNames = "ContentMain" | "ErrorPage" | GlobalClassNames;
