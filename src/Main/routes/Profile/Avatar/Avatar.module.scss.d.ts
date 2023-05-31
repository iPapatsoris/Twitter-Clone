import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Avatar: "Avatar";
  readonly Border: "Border";
  readonly AsBackground: "AsBackground";
};
export = classNames;
export type AvatarNames =
  | "Avatar"
  | "Border"
  | "AsBackground"
  | GlobalClassNames;
