import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Placeholder: "Placeholder";
  readonly TypingArea: "TypingArea";
  readonly Info: "Info";
  readonly Focused: "Focused";
  readonly Empty: "Empty";
  readonly Input: "Input";
  readonly Leader: "Leader";
  readonly Error: "Error";
  readonly InheritCursor: "InheritCursor";
};
export = classNames;
export type ClassNames =
  | "Placeholder"
  | "TypingArea"
  | "Info"
  | "Focused"
  | "Empty"
  | "Input"
  | "Leader"
  | "Error"
  | "InheritCursor"
  | GlobalClassNames;
