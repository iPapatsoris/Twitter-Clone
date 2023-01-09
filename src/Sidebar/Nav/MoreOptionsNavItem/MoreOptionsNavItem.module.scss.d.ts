import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly NoFlexItem: "NoFlexItem";
  readonly Wrapper: "Wrapper";
};
export = classNames;
export type MoreOptionsNavItemNames =
  | "NoFlexItem"
  | "Wrapper"
  | GlobalClassNames;
