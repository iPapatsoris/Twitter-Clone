import Icon from "../../../util/components/Icon/Icon";
import DotsIcon from "../../../assets/icons/dots-gray.png";
import styles from "./Trend.module.scss";
import { useRef, useState } from "react";
import OptionsPopup from "../../../util/components/OptionsPopup/OptionsPopup";
import { OptionWithNested } from "../../../util/components/OptionsPopup/Option";
import IconAndTitle from "../../../util/components/OptionsPopup/IconAndTitle/IconAndTitle";
import sadFaceIcon from "../../../assets/icons/options/sad-face.png";

const Trend = () => {
  const [showOptions, setShowOptions] = useState(false);
  const iconRef = useRef(null);

  const options: OptionWithNested[] = [
    {
      mainOption: {
        component: (
          <IconAndTitle
            icon={sadFaceIcon}
            title="Not interested in this"
            alt="Not interested in trend"
          />
        ),
        id: 0,
        onSelect: () => {},
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
        id: 1,
        onSelect: () => {},
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
          position={{ block: "bottomCover", inline: "rightCover" }}
        />
      )}
      <div className={styles.Trend}>
        <div className={styles.TrendInfo}>
          <span className={styles.Subtitle}>Events · Trending</span>
          <span className={styles.Title}>5 Kim</span>
          <span className={styles.Subtitle}>5,041 Tweets</span>
        </div>
        <div className={styles.MoreIcon}>
          <Icon
            src={DotsIcon}
            title="More"
            alt="More options"
            hover="primary"
            onClick={() => setShowOptions(true)}
            ref={iconRef}
          />
        </div>
      </div>
    </>
  );
};

export default Trend;
