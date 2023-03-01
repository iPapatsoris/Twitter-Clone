import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Placeholder: "Placeholder";
  readonly TypingArea: "TypingArea";
  readonly Focused: "Focused";
  readonly Empty: "Empty";
  readonly InheritCursor: "InheritCursor";
  readonly Info: "Info";
};
export = classNames;
export type InputNames =
  | "Placeholder"
  | "TypingArea"
  | "Focused"
  | "Empty"
  | "InheritCursor"
  | "Info"
  | GlobalClassNames;
