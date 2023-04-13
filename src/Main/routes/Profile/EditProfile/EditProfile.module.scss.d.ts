import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly EditProfile: "EditProfile";
  readonly Cover: "Cover";
  readonly Avatar: "Avatar";
  readonly Content: "Content";
};
export = classNames;
export type EditProfileNames =
  | "EditProfile"
  | "Cover"
  | "Avatar"
  | "Content"
  | GlobalClassNames;
