import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Footer: "Footer";
  readonly Button: "Button";
};
export = classNames;
export type StepperFooterNames = "Footer" | "Button" | GlobalClassNames;
