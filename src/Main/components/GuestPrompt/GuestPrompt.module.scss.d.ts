import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly GuestPrompt: "GuestPrompt";
  readonly Text: "Text";
};
export = classNames;
export type GuestPromptNames = "GuestPrompt" | "Text" | GlobalClassNames;
