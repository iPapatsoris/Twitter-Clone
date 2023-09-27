import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly CreateTweet: "CreateTweet";
  readonly BorderAround: "BorderAround";
  readonly BorderBetween: "BorderBetween";
  readonly Avatar: "Avatar";
  readonly TextArea: "TextArea";
  readonly Widgets: "Widgets";
  readonly LocationIcon: "LocationIcon";
  readonly RightContent: "RightContent";
  readonly Progress: "Progress";
  readonly PostContainer: "PostContainer";
  readonly PostButton: "PostButton";
};
export = classNames;
export type ClassNames =
  | "CreateTweet"
  | "BorderAround"
  | "BorderBetween"
  | "Avatar"
  | "TextArea"
  | "Widgets"
  | "LocationIcon"
  | "RightContent"
  | "Progress"
  | "PostContainer"
  | "PostButton"
  | GlobalClassNames;
