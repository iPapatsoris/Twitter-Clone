import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly SiteInfo: "SiteInfo";
  readonly Copyright: "Copyright";
  readonly More: "More";
  readonly Icon: "Icon";
};
export = classNames;
export type ClassNames =
  | "SiteInfo"
  | "Copyright"
  | "More"
  | "Icon"
  | GlobalClassNames;
