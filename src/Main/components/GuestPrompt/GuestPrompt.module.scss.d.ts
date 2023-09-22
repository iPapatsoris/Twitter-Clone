import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly GuestPrompt: "GuestPrompt";
};
export = classNames;
export type ClassNames = "GuestPrompt" | GlobalClassNames;
