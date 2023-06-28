import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Items: "Items";
  readonly Item: "Item";
  readonly Active: "Active";
};
export = classNames;
export type ClassNames = "Items" | "Item" | "Active" | GlobalClassNames;
