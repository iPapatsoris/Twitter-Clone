import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly SiteInfo: "SiteInfo";
  readonly Copyright: "Copyright";
  readonly More: "More";
};
export = classNames;
export type SiteInfoNames =
  | "SiteInfo"
  | "Copyright"
  | "More"
  | GlobalClassNames;
