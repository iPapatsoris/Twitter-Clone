import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Profile: "Profile";
  readonly Preview: "Preview";
  readonly Hover: "Hover";
  readonly Small: "Small";
  readonly JustAvatar: "JustAvatar";
  readonly Cover: "Cover";
  readonly Edit: "Edit";
  readonly EditAvatar: "EditAvatar";
  readonly Actions: "Actions";
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
  | "Profile"
  | "Preview"
  | "Hover"
  | "Small"
  | "JustAvatar"
  | "Cover"
  | "Edit"
  | "EditAvatar"
  | "Actions"
  | "FixedWidthButton"
  | "Title"
  | "NameAndVerified"
  | "ProfileInfo"
  | "Friendship"
  | "Loading"
  | "TweetMenu"
  | GlobalClassNames;
