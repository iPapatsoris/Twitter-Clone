import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Header: "Header";
  readonly NavIcon: "NavIcon";
  readonly Title: "Title";
};
export = classNames;
export type StepperHeaderNames =
  | "Header"
  | "NavIcon"
  | "Title"
  | GlobalClassNames;
