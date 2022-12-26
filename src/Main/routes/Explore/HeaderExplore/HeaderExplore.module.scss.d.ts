import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly SearchContainer: "SearchContainer";
};
export = classNames;
export type HeaderExploreNames = "SearchContainer" | GlobalClassNames;
