import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Helper: "Helper";
};
export = classNames;
export type HelperNames = "Helper" | GlobalClassNames;
