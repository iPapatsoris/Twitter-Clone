import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Wrapper: "Wrapper";
  readonly Focused: "Focused";
  readonly Placeholder: "Placeholder";
  readonly Typing: "Typing";
  readonly Info: "Info";
};
export = classNames;
export type InputNames =
  | "Wrapper"
  | "Focused"
  | "Placeholder"
  | "Typing"
  | "Info"
  | GlobalClassNames;
