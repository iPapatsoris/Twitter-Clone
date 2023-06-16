import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly IconWrapper: "IconWrapper";
  readonly ExactLeftPlacement: "ExactLeftPlacement";
  readonly ExactVerticalPlacement: "ExactVerticalPlacement";
  readonly Hover: "Hover";
  readonly hover: "hover";
  readonly HoverPrimary: "HoverPrimary";
  readonly HoverGreen: "HoverGreen";
  readonly HoverPink: "HoverPink";
  readonly NoHover: "NoHover";
  readonly Icon: "Icon";
  readonly WithBorder: "WithBorder";
  readonly TweetActions: "TweetActions";
  readonly TweetAction: "TweetAction";
};
export = classNames;
export type TweetActionsNames =
  | "IconWrapper"
  | "ExactLeftPlacement"
  | "ExactVerticalPlacement"
  | "Hover"
  | "hover"
  | "HoverPrimary"
  | "HoverGreen"
  | "HoverPink"
  | "NoHover"
  | "Icon"
  | "WithBorder"
  | "TweetActions"
  | "TweetAction"
  | GlobalClassNames;
