import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Wrapper: "Wrapper";
  readonly Error: "Error";
  readonly Info: "Info";
  readonly Focused: "Focused";
  readonly Empty: "Empty";
  readonly HelperBox: "HelperBox";
};
export = classNames;
export type InputWrapperNames =
  | "Wrapper"
  | "Error"
  | "Info"
  | "Focused"
  | "Empty"
  | "HelperBox"
  | GlobalClassNames;
