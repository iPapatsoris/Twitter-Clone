import { ComponentProps } from "react";
import Icon from "../../../../../util/components/Icon/Icon";
import styles from "./Info.module.scss";

interface IconAndTextProps {
  icon: ComponentProps<typeof Icon>["src"];
  text?: string;
  link?: string;
}

const IconAndText = ({ icon, text = "", link = "" }: IconAndTextProps) => (
  <div className={styles.IconAndText}>
    <Icon noCursorPointer src={icon} hover="none"></Icon>
    {link ? (
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className={styles.PrimaryColor}
      >
        {link}
      </a>
    ) : (
      <span className={styles.LightColor}>{text}</span>
    )}
  </div>
);

export default IconAndText;
