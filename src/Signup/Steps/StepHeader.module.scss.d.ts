import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly StepHeader: "StepHeader";
  readonly NavIcon: "NavIcon";
  readonly Title: "Title";
};
export = classNames;
export type StepHeaderNames =
  | "StepHeader"
  | "NavIcon"
  | "Title"
  | GlobalClassNames;
