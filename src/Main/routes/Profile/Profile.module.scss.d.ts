import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Profile: "Profile";
  readonly Preview: "Preview";
  readonly Medium: "Medium";
  readonly Small: "Small";
  readonly Cover: "Cover";
  readonly Edit: "Edit";
  readonly EditAvatar: "EditAvatar";
  readonly Actions: "Actions";
  readonly FixedWidthButton: "FixedWidthButton";
  readonly Title: "Title";
  readonly NameAndVerified: "NameAndVerified";
  readonly Verified: "Verified";
  readonly Username: "Username";
  readonly ProfileInfo: "ProfileInfo";
  readonly Bio: "Bio";
  readonly Friendship: "Friendship";
  readonly Loading: "Loading";
};
export = classNames;
export type ProfileNames =
  | "Profile"
  | "Preview"
  | "Medium"
  | "Small"
  | "Cover"
  | "Edit"
  | "EditAvatar"
  | "Actions"
  | "FixedWidthButton"
  | "Title"
  | "NameAndVerified"
  | "Verified"
  | "Username"
  | "ProfileInfo"
  | "Bio"
  | "Friendship"
  | "Loading"
  | GlobalClassNames;
