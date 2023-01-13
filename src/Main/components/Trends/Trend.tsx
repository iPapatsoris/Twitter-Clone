import Icon from "../../../util/components/Icon/Icon";
import DotsIcon from "../../../assets/icons/dots-gray.png";
import styles from "./Trend.module.scss";
import { useContext, useRef, useState } from "react";
import OptionsPopup, {
  activatePopupHandler,
} from "../../../util/components/OptionsPopup/OptionsPopup";
import { OptionProps } from "../../../util/components/OptionsPopup/Option";
import IconAndTitle from "../../../util/components/OptionsPopup/IconAndTitle/IconAndTitle";
import sadFaceIcon from "../../../assets/icons/options/sad-face.png";
import { PopupContext } from "../../../App";

const Trend = () => {
  const [showOptions, setShowOptions] = useState(false);
  const { setDisableOuterPointerEvents } = useContext(PopupContext);
  const iconRef = useRef(null);

  // TODO: Correct TS for event
  const onClick = (e: any) => {
    activatePopupHandler({
      e,
      isActivePopup: showOptions,
      setIsActivePopup: setShowOptions,
      setDisableOuterPointerEvents,
    });
  };

  const options: Array<OptionProps> = [
    {
      mainOption: {
        component: (
          <IconAndTitle
            icon={sadFaceIcon}
            title="Not interested in this"
            alt="Not interested in trend"
          />
        ),
        id: "notInterested",
      },
    },
    {
      mainOption: {
        component: (
          <IconAndTitle
            icon={sadFaceIcon}
            alt="Spammy trend"
            title="This trend is harmful or spammy"
          />
        ),
        id: "spam",
      },
    },
  ];

  return (
    <>
      {showOptions && (
        <OptionsPopup
          targetAreaRef={iconRef}
          options={options}
          isActive={showOptions}
          setIsActive={setShowOptions}
        />
      )}
      <div className={styles.Trend}>
        <div className={styles.TrendInfo}>
          <span className={styles.Subtitle}>Events · Trending</span>
          <span className={styles.Title}>5 Kim</span>
          <span className={styles.Subtitle}>5,041 Tweets</span>
        </div>
        <div className={styles.MoreIcon} ref={iconRef}>
          <Icon
            src={DotsIcon}
            title="More"
            alt="More options"
            hover="primary"
            onClick={onClick}
          />
        </div>
      </div>
    </>
  );
};

export default Trend;
