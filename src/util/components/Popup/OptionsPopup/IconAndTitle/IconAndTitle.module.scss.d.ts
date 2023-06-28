import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly IconAndTitle: "IconAndTitle";
  readonly Large: "Large";
  readonly Icon: "Icon";
  readonly Small: "Small";
};
export = classNames;
export type ClassNames =
  | "IconAndTitle"
  | "Large"
  | "Icon"
  | "Small"
  | GlobalClassNames;
