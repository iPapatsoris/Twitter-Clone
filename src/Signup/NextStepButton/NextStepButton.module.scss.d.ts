import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Footer: "Footer";
};
export = classNames;
export type NextStepButtonNames = "Footer" | GlobalClassNames;
