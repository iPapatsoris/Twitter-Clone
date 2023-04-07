import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Profile: "Profile";
  readonly Cover: "Cover";
  readonly AvatarAndActions: "AvatarAndActions";
  readonly AvatarContainer: "AvatarContainer";
  readonly Avatar: "Avatar";
  readonly Actions: "Actions";
  readonly FollowButton: "FollowButton";
  readonly Loading: "Loading";
};
export = classNames;
export type ProfileNames =
  | "Profile"
  | "Cover"
  | "AvatarAndActions"
  | "AvatarContainer"
  | "Avatar"
  | "Actions"
  | "FollowButton"
  | "Loading"
  | GlobalClassNames;
