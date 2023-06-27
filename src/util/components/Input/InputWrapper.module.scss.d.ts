import globalClassNames from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Wrapper: InputWrapperNames;
  readonly Error: InputWrapperNames;
  readonly Info: InputWrapperNames;
  readonly Focused: InputWrapperNames;
  readonly Empty: InputWrapperNames;
  readonly HelperBox: InputWrapperNames;
};
export = classNames;
