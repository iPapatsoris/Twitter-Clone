import globalClassNames from "../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Wrapper: "Wrapper";
  readonly Login: "Login";
  readonly Form: "Form";
  readonly Error: "Error";
};
export = classNames;
