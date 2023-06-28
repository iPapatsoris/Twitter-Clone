import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly InboxSticky: "InboxSticky";
  readonly InboxStickyContent: "InboxStickyContent";
  readonly PushRight: "PushRight";
};
export = classNames;
export type ClassNames =
  | "InboxSticky"
  | "InboxStickyContent"
  | "PushRight"
  | GlobalClassNames;
