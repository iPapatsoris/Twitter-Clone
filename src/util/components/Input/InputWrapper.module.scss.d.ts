import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Wrapper: "Wrapper";
  readonly Focused: "Focused";
  readonly Info: "Info";
};
export = classNames;
export type InputWrapperNames =
  | "Wrapper"
  | "Focused"
  | "Info"
  | GlobalClassNames;
