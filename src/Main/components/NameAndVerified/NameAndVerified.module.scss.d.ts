import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly NameAndVerified: "NameAndVerified";
  readonly AbbreviateOverflow: "AbbreviateOverflow";
  readonly Name: "Name";
  readonly UnderlineOnHover: "UnderlineOnHover";
  readonly VerifiedIcon: "VerifiedIcon";
};
export = classNames;
export type ClassNames =
  | "NameAndVerified"
  | "AbbreviateOverflow"
  | "Name"
  | "UnderlineOnHover"
  | "VerifiedIcon"
  | GlobalClassNames;
