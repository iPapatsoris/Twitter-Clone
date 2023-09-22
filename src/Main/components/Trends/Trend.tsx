import Icon from "../../../util/components/Icon/Icon";
import { ReactComponent as DotsIcon } from "../../../assets/icons/dots-gray.svg";
import styles from "./Trend.module.scss";
import { useRef, useState } from "react";
import OptionsPopup from "../../../util/components/Popup/OptionsPopup/OptionsPopup";
import { OptionWithNested } from "../../../util/components/Popup/OptionsPopup/Option";
import IconAndTitle from "../../../util/components/Popup/OptionsPopup/IconAndTitle/IconAndTitle";
import { ReactComponent as SadFaceIcon } from "../../../assets/icons/options/sad-face.svg";
import { Trend as TrendT } from "../../../../backend/src/api/tweet";

const Trend = ({ trend }: { trend: TrendT }) => {
  const [showOptions, setShowOptions] = useState(false);
  const iconRef = useRef(null);

  const options: OptionWithNested[] = [
    {
      mainOption: {
        component: (
          <IconAndTitle
            icon={SadFaceIcon}
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
            icon={SadFaceIcon}
            alt="Spammy trend"
            title="This trend is harmful or spammy"
          />
        ),
        id: 1,
        onSelect: () => {},
      },
    },
  ];

  const { tweets, trend: trendKeyword, category } = trend;

  return (
    <>
      {showOptions && (
        <OptionsPopup
          options={options}
          popupProps={{
            targetAreaRef: iconRef,
            setIsActive: setShowOptions,
            position: { block: "bottomCover", inline: "rightCover" },
            isFixed: false,
          }}
        />
      )}
      <div className={styles.Trend}>
        <div className={styles.TrendInfo}>
          <span className={[styles.LightColor, styles.SmallText].join(" ")}>
            {category} {category ? "·" : ""} Trending
          </span>
          <span className={[styles.Bold, styles.BigText].join(" ")}>
            {trendKeyword}
          </span>
          <span className={[styles.LightColor, styles.SmallText].join(" ")}>
            {tweets} Tweets
          </span>
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
