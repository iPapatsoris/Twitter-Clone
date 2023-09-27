import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly CreateTweetModal: "CreateTweetModal";
  readonly CloseIcon: "CloseIcon";
};
export = classNames;
export type ClassNames = "CreateTweetModal" | "CloseIcon" | GlobalClassNames;
