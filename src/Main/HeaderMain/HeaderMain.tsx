import "./HeaderMain.scss";
import sparkIcon from "../../assets/icons/spark.png";
import Icon from "../../util/Icon/Icon";
const HeaderMain = () => {
  return (
    <div className="HeaderMain">
      <h2>Home</h2>
      <Icon src={sparkIcon} title="Top Tweets" />
    </div>
  );
};
export default HeaderMain;
