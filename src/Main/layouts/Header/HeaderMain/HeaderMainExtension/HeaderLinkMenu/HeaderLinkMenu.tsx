import { Link, useLocation } from "react-router-dom";
import { getPagePath, Page } from "../../../../../../util/paths";
import styles from "./HeaderLinkMenu.module.scss";

type HeaderLinkMenuProps = {
  items: Array<{ page: Page; username?: string; title: string }>;
};

const HeaderLinkMenu = ({ items }: HeaderLinkMenuProps) => {
  const path = useLocation().pathname;
  const menu = items.map((item) => {
    const itemPath = getPagePath(item.page, item.username);
    return (
      <Link to={itemPath} key={item.page}>
        <div
          className={[styles.Item, path === itemPath ? styles.Active : ""].join(
            " "
          )}
        >
          {item.title}
        </div>
      </Link>
    );
  });

  return <div className={styles.Items}>{menu}</div>;
};

export default HeaderLinkMenu;
