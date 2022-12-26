import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Trend: "Trend";
  readonly TrendInfo: "TrendInfo";
  readonly Title: "Title";
  readonly Subtitle: "Subtitle";
  readonly MoreIcon: "MoreIcon";
};
export = classNames;
export type TrendNames =
  | "Trend"
  | "TrendInfo"
  | "Title"
  | "Subtitle"
  | "MoreIcon"
  | GlobalClassNames;
