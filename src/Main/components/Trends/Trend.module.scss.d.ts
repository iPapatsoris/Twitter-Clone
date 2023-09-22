import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly NoFlexItem: "NoFlexItem";
  readonly Trend: "Trend";
  readonly TrendInfo: "TrendInfo";
  readonly MoreIcon: "MoreIcon";
};
export = classNames;
export type ClassNames =
  | "NoFlexItem"
  | "Trend"
  | "TrendInfo"
  | "MoreIcon"
  | GlobalClassNames;
