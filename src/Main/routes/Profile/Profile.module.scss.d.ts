import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Loading: "Loading";
};
export = classNames;
export type ProfileNames = "Loading" | GlobalClassNames;
