import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly OuterWrapper: "OuterWrapper";
  readonly Fixed: "Fixed";
};
export = classNames;
export type ModalWrapperNames = "OuterWrapper" | "Fixed" | GlobalClassNames;
