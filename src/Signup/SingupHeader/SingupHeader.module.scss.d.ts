import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Header: "Header";
};
export = classNames;
export type SingupHeaderNames = "Header" | GlobalClassNames;
