import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly TweetActions: "TweetActions";
  readonly SpaceAround: "SpaceAround";
  readonly SpaceBetween: "SpaceBetween";
};
export = classNames;
export type ClassNames =
  | "TweetActions"
  | "SpaceAround"
  | "SpaceBetween"
  | GlobalClassNames;
