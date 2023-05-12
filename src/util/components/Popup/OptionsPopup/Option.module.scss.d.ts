import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Option: "Option";
  readonly Icon: "Icon";
  readonly RotateIcon: "RotateIcon";
};
export = classNames;
export type OptionNames = "Option" | "Icon" | "RotateIcon" | GlobalClassNames;
