import styles from "./SiteInfo.module.scss";
import { Link } from "react-router-dom";
import Icon from "../../../util/components/Icon/Icon";
import dotsIcon from "../../../assets/icons/dots-gray.png";

const SiteInfo = () => {
  return (
    <div className={styles.SiteInfo}>
      <Link to={""}>
        <span>Terms of Service</span>
      </Link>
      <Link to={""}>
        <span>Privacy Policy</span>
      </Link>
      <Link to={""}>
        <span>Cookie Policy</span>
      </Link>
      <br />
      <Link to={""}>
        <span>Accessibility</span>
      </Link>
      <Link to={""}>
        <span>Ads info</span>
      </Link>
      <span className={styles.More}>
        More
        <Icon src={dotsIcon} hoverBg="none" size="tiny" alt="More options" />
      </span>
      <br />
      <span className={styles.Copyright}>© 2023 Twitter, Inc.</span>
    </div>
  );
};

export default SiteInfo;
