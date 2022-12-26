import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly IconAndTitleWrapper: "IconAndTitleWrapper";
  readonly IconAndTitle: "IconAndTitle";
};
export = classNames;
export type NavNames =
  | "IconAndTitleWrapper"
  | "IconAndTitle"
  | GlobalClassNames;
