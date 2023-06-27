import globalClassNames from "../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly ContentMain: MainNames;
  readonly ErrorPage: MainNames;
};
export = classNames;
