import Icon from "../../../util/components/Icon/Icon";
import DotsIcon from "../../../assets/icons/dots-gray.png";
import styles from "./Trend.module.scss";

const Trend = () => {
  return (
    <div className={styles.Trend}>
      <div className={styles.TrendInfo}>
        <span className={styles.Subtitle}>Events · Trending</span>
        <span className={styles.Title}>5 Kim</span>
        <span className={styles.Subtitle}>5,041 Tweets</span>
      </div>
      <div className={styles.MoreIcon}>
        <Icon src={DotsIcon} title="More" hoverBg="primary" />
      </div>
    </div>
  );
};

export default Trend;
