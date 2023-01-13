import Icon from "../../../../util/components/Icon/Icon";
import Search from "../../../components/Search/Search";
import styles from "./HeaderExplore.module.scss";
import settingsIcon from "../../../../assets/icons/settings.png";

interface HeaderExploreProps {}

const HeaderExplore = (props: HeaderExploreProps) => {
  return (
    <>
      <div className={styles.SearchContainer}>
        <Search />
      </div>
      <div className={styles.PushRight}>
        <Icon src={settingsIcon} title="Settings" alt="Settings" />
      </div>
    </>
  );
};

export default HeaderExplore;
