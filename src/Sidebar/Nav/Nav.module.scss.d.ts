import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly NavItem: "NavItem";
  readonly IconAndTitle: "IconAndTitle";
  readonly Icon: "Icon";
};
export = classNames;
export type ClassNames = "NavItem" | "IconAndTitle" | "Icon" | GlobalClassNames;
