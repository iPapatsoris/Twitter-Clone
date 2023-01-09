import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly NoFlexItem: "NoFlexItem";
};
export = classNames;
export type MoreOptionsNavItemNames = "NoFlexItem" | GlobalClassNames;
