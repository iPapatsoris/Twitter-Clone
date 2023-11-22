import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Wrapper: "Wrapper";
  readonly Label: "Label";
  readonly Leader: "Leader";
  readonly Focused: "Focused";
  readonly Error: "Error";
  readonly MaxCount: "MaxCount";
  readonly Empty: "Empty";
  readonly Info: "Info";
  readonly Placeholder: "Placeholder";
  readonly TypingArea: "TypingArea";
  readonly Input: "Input";
  readonly InheritCursor: "InheritCursor";
  readonly SuccessIcon: "SuccessIcon";
  readonly HelperBox: "HelperBox";
};
export = classNames;
export type ClassNames =
  | "Wrapper"
  | "Label"
  | "Leader"
  | "Focused"
  | "Error"
  | "MaxCount"
  | "Empty"
  | "Info"
  | "Placeholder"
  | "TypingArea"
  | "Input"
  | "InheritCursor"
  | "SuccessIcon"
  | "HelperBox"
  | GlobalClassNames;
