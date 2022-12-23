import Icon from "../../../../util/Icon/Icon";
import Search from "../../../components/Search/Search";
import "./HeaderExplore.scss";
import settingsIcon from "../../../../assets/icons/settings.png";

interface HeaderExploreProps {}

const HeaderExplore = (props: HeaderExploreProps) => {
  return (
    <>
      <div className="SearchContainer">
        <Search />
      </div>
      <div className="PushRight">
        <Icon src={settingsIcon} title="Settings" />
      </div>
    </>
  );
};

export default HeaderExplore;
