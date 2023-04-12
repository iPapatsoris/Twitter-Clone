import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly NavIcon: "NavIcon";
  readonly Logo: "Logo";
  readonly LogoSize: "LogoSize";
};
export = classNames;
export type LogoHeaderNames =
  | "NavIcon"
  | "Logo"
  | "LogoSize"
  | GlobalClassNames;
