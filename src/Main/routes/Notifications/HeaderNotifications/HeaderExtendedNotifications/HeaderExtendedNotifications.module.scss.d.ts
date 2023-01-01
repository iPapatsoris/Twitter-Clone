import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly NotificationCategories: "NotificationCategories";
  readonly NotificationCategory: "NotificationCategory";
};
export = classNames;
export type HeaderExtendedNotificationsNames =
  | "NotificationCategories"
  | "NotificationCategory"
  | GlobalClassNames;
