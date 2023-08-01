import styles from "./Search.module.scss";
import { ReactComponent as SearchIcon } from "../../../assets/icons/search.svg";
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
      <Icon src={SearchIcon } hover="none" alt="Search" />
      <input ref={inputRef} type="text" placeholder="Search Twitter" />
    </div>
  );
};

export default Search;
