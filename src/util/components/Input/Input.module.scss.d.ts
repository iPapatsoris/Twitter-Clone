import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Placeholder: "Placeholder";
  readonly TypingArea: "TypingArea";
  readonly Info: "Info";
};
export = classNames;
export type InputNames =
  | "Placeholder"
  | "TypingArea"
  | "Info"
  | GlobalClassNames;