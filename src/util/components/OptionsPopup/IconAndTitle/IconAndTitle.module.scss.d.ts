import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly IconAndTitle: "IconAndTitle";
  readonly Large: "Large";
  readonly LargeIcon: "LargeIcon";
  readonly Small: "Small";
};
export = classNames;
export type IconAndTitleNames =
  | "IconAndTitle"
  | "Large"
  | "LargeIcon"
  | "Small"
  | GlobalClassNames;
