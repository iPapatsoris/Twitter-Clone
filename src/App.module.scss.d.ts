import globalClassNames from "./style.d";
declare const classNames: typeof globalClassNames & {
  readonly App: "App";
  readonly NoHeaderRight: "NoHeaderRight";
};
export = classNames;
