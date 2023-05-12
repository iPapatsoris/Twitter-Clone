import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Profile: "Profile";
  readonly Cover: "Cover";
  readonly Avatar: "Avatar";
  readonly Actions: "Actions";
  readonly FollowButton: "FollowButton";
  readonly ProfileInfo: "ProfileInfo";
  readonly Title: "Title";
  readonly NameAndVerified: "NameAndVerified";
  readonly Username: "Username";
  readonly Bio: "Bio";
  readonly Friendship: "Friendship";
  readonly Loading: "Loading";
};
export = classNames;
export type ProfileNames =
  | "Profile"
  | "Cover"
  | "Avatar"
  | "Actions"
  | "FollowButton"
  | "ProfileInfo"
  | "Title"
  | "NameAndVerified"
  | "Username"
  | "Bio"
  | "Friendship"
  | "Loading"
  | GlobalClassNames;
