import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Stepper: "Stepper";
  readonly Wrapper: "Wrapper";
  readonly Content: "Content";
};
export = classNames;
export type StepperNames = "Stepper" | "Wrapper" | "Content" | GlobalClassNames;
