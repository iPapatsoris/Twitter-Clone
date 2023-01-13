import topicsIcon from "../../../assets/icons/options/topics.png";
import twitterCircleIcon from "../../../assets/icons/options/twitter-circle.png";
import newslettersIcon from "../../../assets/icons/options/newsletters.png";
import analyticsIcon from "../../../assets/icons/options/analytics.png";
import rocketIcon from "../../../assets/icons/options/rocket.png";
import adsIcon from "../../../assets/icons/options/ads.png";
import settingsIcon from "../../../assets/icons/settings.png";
import helpIcon from "../../../assets/icons/options/help.png";
import displayIcon from "../../../assets/icons/options/display.png";
import shortcutsIcon from "../../../assets/icons/options/shortcuts.png";
import monetizationIcon from "../../../assets/icons/options/monetization.png";
import IconAndTitle from "../../../util/components/OptionsPopup/IconAndTitle/IconAndTitle";
import { OptionType } from "../../../util/components/OptionsPopup/Option";

export const navMoreOptionsList: Array<OptionType> = [
  {
    mainOption: {
      component: (
        <IconAndTitle
          title="Topics"
          alt="Topics"
          icon={topicsIcon}
          size="large"
        />
      ),
      id: "topics",
    },
  },
  {
    mainOption: {
      component: (
        <IconAndTitle
          title="Twitter Circle"
          alt="Twitter circle"
          icon={twitterCircleIcon}
          size="large"
        />
      ),
      id: "circle",
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
            title="Newsletters"
            alt="Newsletters"
            icon={newslettersIcon}
          />
        ),
        id: "newsletters",
      },
      {
        component: (
          <IconAndTitle
            title="Analytics"
            alt="Analytics"
            icon={analyticsIcon}
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
          <IconAndTitle
            title="Twitter for Professionals"
            alt="Twitter for professionals"
            icon={rocketIcon}
          />
        ),
        id: "pros",
      },
      {
        component: (
          <IconAndTitle title="Twitter Ads" alt="Twitter ads" icon={adsIcon} />
        ),
        id: "ads",
      },
      {
        component: (
          <IconAndTitle
            title="Monetization"
            alt="Monetization"
            icon={monetizationIcon}
          />
        ),
        id: "monetization",
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
            icon={settingsIcon}
          />
        ),
        id: "settings",
      },
      {
        component: (
          <IconAndTitle title="Help Center" alt="Help center" icon={helpIcon} />
        ),
        id: "help",
      },
      {
        component: (
          <IconAndTitle title="Display" alt="Display" icon={displayIcon} />
        ),
        id: "display",
      },
      {
        component: (
          <IconAndTitle
            title="Keyboard Shortcuts"
            alt="Keyboard shortcuts"
            icon={shortcutsIcon}
          />
        ),
        id: "shortcuts",
      },
    ],
  },
];
