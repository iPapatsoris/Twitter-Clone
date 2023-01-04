import Icon from "../../../../util/components/Icon/Icon";
import sparkIcon from "../../../../assets/icons/spark.png";

const HeaderHome = () => {
  return (
    <>
      <h2>Home</h2>
      <div className="PushRight">
        <Icon src={sparkIcon} title="Top Tweets" />
      </div>
    </>
  );
};

export default HeaderHome;
