import Icon from "../../../util/Icon/Icon";
import DotsIcon from "../../../assets/icons/dots-gray.png";
import "./Trend.scss";

const Trend = () => {
  return (
    <div className="Trend">
      <div className="TrendInfo">
        <span className="Subtitle">Events · Trending</span>
        <span className="Title">5 Kim</span>
        <span className="Subtitle">5,041 Tweets</span>
      </div>
      <div className="MoreIcon">
        <Icon src={DotsIcon} title="More" blueHover />
      </div>
    </div>
  );
};

export default Trend;
