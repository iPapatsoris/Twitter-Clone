import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly NavItem: "NavItem";
  readonly IconAndTitle: "IconAndTitle";
};
export = classNames;
export type NavNames = "NavItem" | "IconAndTitle" | GlobalClassNames;
