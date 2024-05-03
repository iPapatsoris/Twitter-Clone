import globalClassNames from "./common.d";
declare const classNames: typeof globalClassNames & {
  readonly mobileBreakpoint: "mobileBreakpoint";
  readonly tabletBreakpoint: "tabletBreakpoint";
  readonly pcSmallBreakpoint: "pcSmallBreakpoint";
  readonly primaryColor: "primaryColor";
  readonly lightColor: "lightColor";
};
export = classNames;
