import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly NoFlexItem: "NoFlexItem";
  readonly Trend: "Trend";
  readonly TrendInfo: "TrendInfo";
  readonly Title: "Title";
  readonly Subtitle: "Subtitle";
  readonly MoreIcon: "MoreIcon";
};
export = classNames;
export type ClassNames =
  | "NoFlexItem"
  | "Trend"
  | "TrendInfo"
  | "Title"
  | "Subtitle"
  | "MoreIcon"
  | GlobalClassNames;
