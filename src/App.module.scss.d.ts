import globalClassNames from "./style.d";
declare const classNames: typeof globalClassNames & {
  readonly App: AppNames;
  readonly NoHeaderRight: AppNames;
  readonly ExtendedHeaderMain: AppNames;
  readonly ErrorPage: AppNames;
};
export = classNames;
