import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly NameAndVerified: "NameAndVerified";
  readonly UnderlineOnHover: "UnderlineOnHover";
  readonly Big: "Big";
};
export = classNames;
export type ClassNames =
  | "NameAndVerified"
  | "UnderlineOnHover"
  | "Big"
  | GlobalClassNames;
