import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly TweetActions: "TweetActions";
  readonly SpaceAround: "SpaceAround";
  readonly SpaceBetween: "SpaceBetween";
  readonly Modal: "Modal";
};
export = classNames;
export type ClassNames =
  | "TweetActions"
  | "SpaceAround"
  | "SpaceBetween"
  | "Modal"
  | GlobalClassNames;
