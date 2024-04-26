import globalClassNames from "./assets/styles/common.d";
declare const classNames: typeof globalClassNames & {
  readonly App: "App";
  readonly NoHeaderRight: "NoHeaderRight";
};
export = classNames;
