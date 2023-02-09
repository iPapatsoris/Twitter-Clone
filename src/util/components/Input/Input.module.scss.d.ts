import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Wrapper: "Wrapper";
  readonly Focused: "Focused";
  readonly Placeholder: "Placeholder";
  readonly TypingArea: "TypingArea";
  readonly Info: "Info";
  readonly Color: "Color";
};
export = classNames;
export type InputNames =
  | "Wrapper"
  | "Focused"
  | "Placeholder"
  | "TypingArea"
  | "Info"
  | "Color"
  | GlobalClassNames;
