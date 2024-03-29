import styles from "./SiteInfo.module.scss";
import { Link } from "react-router-dom";
import Icon from "../../../util/components/Icon/Icon";
import { ReactComponent as DotsIcon } from "../../../assets/icons/dots-gray.svg";

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
        <Icon src={DotsIcon} size={13} hover="none" alt="More options" />
      </span>
      <br />
      <span className={styles.Copyright}>© 2023 Twitter, Inc.</span>
    </div>
  );
};

export default SiteInfo;
