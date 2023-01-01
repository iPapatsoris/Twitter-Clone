import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly NotificationCategories: "NotificationCategories";
  readonly NotificationCategory: "NotificationCategory";
  readonly Active: "Active";
};
export = classNames;
export type HeaderExtendedNotificationsNames =
  | "NotificationCategories"
  | "NotificationCategory"
  | "Active"
  | GlobalClassNames;
