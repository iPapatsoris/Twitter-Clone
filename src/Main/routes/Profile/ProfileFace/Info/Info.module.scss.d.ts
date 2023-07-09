import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Info: "Info";
  readonly IconAndText: "IconAndText";
};
export = classNames;
export type ClassNames = "Info" | "IconAndText" | GlobalClassNames;
