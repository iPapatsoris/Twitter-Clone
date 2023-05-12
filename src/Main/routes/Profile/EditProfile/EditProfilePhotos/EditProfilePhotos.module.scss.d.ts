import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly AddPhoto: "AddPhoto";
  readonly Avatar: "Avatar";
};
export = classNames;
export type EditProfilePhotosNames = "AddPhoto" | "Avatar" | GlobalClassNames;
