import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly OuterWrapper: "OuterWrapper";
};
export = classNames;
export type ModalWrapperNames = "OuterWrapper" | GlobalClassNames;
