import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly EditProfile: "EditProfile";
  readonly AddPhoto: "AddPhoto";
  readonly Cover: "Cover";
  readonly Avatar: "Avatar";
  readonly Content: "Content";
};
export = classNames;
export type EditProfileNames =
  | "EditProfile"
  | "AddPhoto"
  | "Cover"
  | "Avatar"
  | "Content"
  | GlobalClassNames;
