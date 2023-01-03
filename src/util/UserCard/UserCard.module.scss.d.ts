import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly UserCard: "UserCard";
  readonly Avatar: "Avatar";
  readonly Name: "Name";
  readonly Username: "Username";
  readonly Action: "Action";
  readonly Standalone: "Standalone";
};
export = classNames;
export type UserCardNames =
  | "UserCard"
  | "Avatar"
  | "Name"
  | "Username"
  | "Action"
  | "Standalone"
  | GlobalClassNames;
