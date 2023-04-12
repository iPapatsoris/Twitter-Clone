import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly StepHeader: "StepHeader";
  readonly NavIcon: "NavIcon";
};
export = classNames;
export type StepHeaderNames = "StepHeader" | "NavIcon" | GlobalClassNames;
