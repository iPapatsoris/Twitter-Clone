import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Preview: "Preview";
  readonly Actions: "Actions";
  readonly Profile: "Profile";
  readonly Hover: "Hover";
  readonly Small: "Small";
  readonly JustAvatar: "JustAvatar";
  readonly Cover: "Cover";
  readonly Edit: "Edit";
  readonly EditAvatar: "EditAvatar";
  readonly FixedWidthButton: "FixedWidthButton";
  readonly Title: "Title";
  readonly NameAndVerified: "NameAndVerified";
  readonly ProfileInfo: "ProfileInfo";
  readonly Friendship: "Friendship";
  readonly Loading: "Loading";
  readonly TweetMenu: "TweetMenu";
};
export = classNames;
export type ClassNames =
  | "Preview"
  | "Actions"
  | "Profile"
  | "Hover"
  | "Small"
  | "JustAvatar"
  | "Cover"
  | "Edit"
  | "EditAvatar"
  | "FixedWidthButton"
  | "Title"
  | "NameAndVerified"
  | "ProfileInfo"
  | "Friendship"
  | "Loading"
  | "TweetMenu"
  | GlobalClassNames;
