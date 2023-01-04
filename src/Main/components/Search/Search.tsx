import styles from "./Search.module.scss";
import searchIcon from "../../../assets/icons/search.png";
import { useRef } from "react";
import Icon from "../../../util/components/Icon/Icon";

const Search = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={styles.Search} onClick={handleClick}>
      <Icon src={searchIcon} hoverBg="none" />
      <input ref={inputRef} type="text" placeholder="Search Twitter" />
    </div>
  );
};

export default Search;
