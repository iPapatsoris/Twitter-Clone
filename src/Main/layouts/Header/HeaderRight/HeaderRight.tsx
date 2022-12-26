import Search from "../../../components/Search/Search";
import style from "./HeaderRight.module.scss";
const HeaderRight = () => {
  return (
    <div className={style.HeaderRight}>
      <Search />
    </div>
  );
};

export default HeaderRight;
