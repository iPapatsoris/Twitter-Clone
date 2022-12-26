import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly ContentRightSection: "ContentRightSection";
  readonly ShowMore: "ShowMore";
};
export = classNames;
export type ContentRightSectionNames =
  | "ContentRightSection"
  | "ShowMore"
  | GlobalClassNames;
