import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly MainTweet: "MainTweet";
  readonly MainInfo: "MainInfo";
  readonly Text: "Text";
  readonly Stats: "Stats";
  readonly Actions: "Actions";
};
export = classNames;
export type ClassNames =
  | "MainTweet"
  | "MainInfo"
  | "Text"
  | "Stats"
  | "Actions"
  | GlobalClassNames;
