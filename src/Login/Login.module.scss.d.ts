import globalClassNames from "../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Wrapper: LoginNames;
  readonly Login: LoginNames;
};
export = classNames;
