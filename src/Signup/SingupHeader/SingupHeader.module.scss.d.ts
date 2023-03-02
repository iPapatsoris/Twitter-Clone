import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Header: "Header";
  readonly NavIcon: "NavIcon";
};
export = classNames;
export type SingupHeaderNames = "Header" | "NavIcon" | GlobalClassNames;
