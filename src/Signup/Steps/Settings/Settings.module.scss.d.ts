import globalClassNames, {
  ClassNames as GlobalClassNames,
} from "../../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly Settings: "Settings";
  readonly SettingsList: "SettingsList";
};
export = classNames;
export type SettingsNames = "Settings" | "SettingsList" | GlobalClassNames;
