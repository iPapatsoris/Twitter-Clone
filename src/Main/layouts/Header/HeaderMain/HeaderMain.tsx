import Icon from "../../../../util/components/Icon/Icon";
import styles from "./HeaderMain.module.scss";
import { ReactComponent as BackIcon } from "../../../../assets/icons/left-arrow.svg";
import { useNavigate } from "react-router-dom";

interface NewHeaderProps {
  title?: React.ReactElement;
  subtitle?: React.ReactElement;
  singleComponent?: React.ReactElement;
  leftCornerBackIcon?: boolean;
  rightCornerIcon?: React.ReactElement;
  extension?: React.ReactElement;
}

const HeaderMain = ({
  title,
  subtitle,
  singleComponent,
  leftCornerBackIcon = false,
  rightCornerIcon,
  extension,
}: NewHeaderProps) => {
  const navitage = useNavigate();
  const handleBackClick = () => navitage(-1);

  const main = singleComponent ? (
    singleComponent
  ) : (
    <div className={styles.TitleSubtitle}>
      <div className={styles.Title}>{title}</div>
      {subtitle && (
        <div className={[styles.SmallerText, styles.LightColor].join(" ")}>
          {subtitle}
        </div>
      )}
    </div>
  );

  return (
    <div
      className={[
        styles.HeaderMain,
        styles.Sticky,
        extension ? styles.HeaderExtendedGridArea : styles.HeaderMainGridArea,
      ].join(" ")}
    >
      <div className={styles.Main}>
        {leftCornerBackIcon && (
          <Icon src={BackIcon } title={"Back"} onClick={handleBackClick} />
        )}
        {main}
        {rightCornerIcon && <div className="PushRight">{rightCornerIcon}</div>}
      </div>
      {extension}
    </div>
  );
};

export default HeaderMain;
