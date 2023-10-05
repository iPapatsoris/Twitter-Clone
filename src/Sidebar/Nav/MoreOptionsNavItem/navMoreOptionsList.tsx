import { ReactComponent as ConnectIcon } from "../../../assets/icons/options/connect.svg";
import { ReactComponent as DraftsIcon } from "../../../assets/icons/options/drafts.svg";
import { ReactComponent as AnalyticsIcon } from "../../../assets/icons/options/analytics.svg";
import { ReactComponent as AdsIcon } from "../../../assets/icons/options/ads.svg";
import { ReactComponent as SettingsIcon } from "../../../assets/icons/settings.svg";
import { ReactComponent as HelpIcon } from "../../../assets/icons/options/help.svg";
import { ReactComponent as DisplayIcon } from "../../../assets/icons/options/display.svg";
import { ReactComponent as ShortcutsIcon } from "../../../assets/icons/options/shortcuts.svg";
import { ReactComponent as MonetizationIcon } from "../../../assets/icons/options/monetization.svg";
import IconAndTitle from "../../../util/components/Popup/OptionsPopup/IconAndTitle/IconAndTitle";
import { OptionWithNested } from "../../../util/components/Popup/OptionsPopup/Option";

export const navMoreOptionsList: OptionWithNested[] = [
  {
    mainOption: {
      component: (
        <IconAndTitle
          title="Connect"
          alt="Connect"
          icon={ConnectIcon}
          size="large"
        />
      ),
      id: "connect",
    },
  },
  {
    mainOption: {
      component: (
        <IconAndTitle
          title="Drafts"
          alt="Drafts"
          icon={DraftsIcon}
          size="large"
        />
      ),
      id: "drafts",
    },
  },
  {
    mainOption: {
      component: (
        <IconAndTitle
          title="Monetization"
          alt="Monetization"
          icon={MonetizationIcon}
          size="large"
        />
      ),
      id: "monetization",
    },
  },
  {
    mainOption: {
      component: "Creator Studio",
      id: "studio",
    },
    nestedOptions: [
      {
        component: (
          <IconAndTitle
            title="Analytics"
            alt="Analytics"
            icon={AnalyticsIcon}
          />
        ),
        id: "analytics",
      },
    ],
  },
  {
    mainOption: {
      component: "Professional Tools",
      id: "pro-tools",
    },
    nestedOptions: [
      {
        component: (
          <IconAndTitle title="Twitter Ads" alt="Twitter ads" icon={AdsIcon} />
        ),
        id: "ads",
      },
    ],
  },
  {
    mainOption: {
      component: "Settings and Support",
      id: "settings-support",
    },
    nestedOptions: [
      {
        component: (
          <IconAndTitle
            title="Settings and Privacy"
            alt="Settings and Privacy"
            icon={SettingsIcon}
          />
        ),
        id: "settings",
      },
      {
        component: (
          <IconAndTitle title="Help Center" alt="Help center" icon={HelpIcon} />
        ),
        id: "help",
      },
      {
        component: (
          <IconAndTitle title="Display" alt="Display" icon={DisplayIcon} />
        ),
        id: "display",
      },
      {
        component: (
          <IconAndTitle
            title="Keyboard Shortcuts"
            alt="Keyboard shortcuts"
            icon={ShortcutsIcon}
          />
        ),
        id: "shortcuts",
      },
    ],
  },
];
