import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly CreateTweet: "CreateTweet";
  readonly AsModalContent: "AsModalContent";
  readonly CloseIcon: "CloseIcon";
  readonly Border: "Border";
  readonly Avatar: "Avatar";
  readonly TextArea: "TextArea";
  readonly Widgets: "Widgets";
  readonly LocationIcon: "LocationIcon";
  readonly Action: "Action";
  readonly Progress: "Progress";
  readonly Show: "Show";
  readonly Hide: "Hide";
};
export = classNames;
export type ClassNames =
  | "CreateTweet"
  | "AsModalContent"
  | "CloseIcon"
  | "Border"
  | "Avatar"
  | "TextArea"
  | "Widgets"
  | "LocationIcon"
  | "Action"
  | "Progress"
  | "Show"
  | "Hide"
  | GlobalClassNames;
