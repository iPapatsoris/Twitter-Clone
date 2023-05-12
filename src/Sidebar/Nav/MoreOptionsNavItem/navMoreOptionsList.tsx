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
import IconAndTitle from "../../../util/components/Popup/OptionsPopup/IconAndTitle/IconAndTitle";
import { OptionWithNested } from "../../../util/components/Popup/OptionsPopup/Option";

const onSelect = () => {};
export const navMoreOptionsList: OptionWithNested[] = [
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
      onSelect,
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
      onSelect,
    },
  },
  {
    mainOption: {
      component: "Creator Studio",
      id: "studio",
      onSelect,
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
        onSelect,
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
        onSelect,
      },
    ],
  },
  {
    mainOption: {
      component: "Professional Tools",
      id: "pro-tools",
      onSelect,
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
        onSelect,
      },
      {
        component: (
          <IconAndTitle title="Twitter Ads" alt="Twitter ads" icon={adsIcon} />
        ),
        id: "ads",
        onSelect,
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
        onSelect,
      },
    ],
  },
  {
    mainOption: {
      component: "Settings and Support",
      id: "settings-support",
      onSelect,
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
        onSelect,
      },
      {
        component: (
          <IconAndTitle title="Help Center" alt="Help center" icon={helpIcon} />
        ),
        id: "help",
        onSelect,
      },
      {
        component: (
          <IconAndTitle title="Display" alt="Display" icon={displayIcon} />
        ),
        id: "display",
        onSelect,
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
        onSelect,
      },
    ],
  },
];
