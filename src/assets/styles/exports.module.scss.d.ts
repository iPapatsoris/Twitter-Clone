import globalClassNames from "../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly mobileBreakpoint: "mobileBreakpoint";
  readonly tabletBreakpoint: "tabletBreakpoint";
  readonly pcSmallBreakpoint: "pcSmallBreakpoint";
};
export = classNames;
