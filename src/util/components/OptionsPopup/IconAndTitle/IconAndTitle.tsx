import styles from "./IconAndTitle.module.scss";
import { ReactElement } from "react";
import { IconProps } from "../../Icon/Icon";

interface IconAndTitleProps {
  icon: ReactElement<IconProps>;
  title: string;
}

const IconAndTitle = ({ icon, title }: IconAndTitleProps) => (
  <div className={styles.IconAndTitle}>
    {icon}
    {title}
  </div>
);

export default IconAndTitle;
