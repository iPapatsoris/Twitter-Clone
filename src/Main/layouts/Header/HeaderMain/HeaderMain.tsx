import Icon from "../../../../util/components/Icon/Icon";
import styles from "./HeaderMain.module.scss";
import { ReactComponent as BackIcon } from "../../../../assets/icons/left-arrow.svg";
import { useNavigate } from "react-router-dom";

interface NewHeaderProps {
  title?: React.ReactElement;
  subtitle?: React.ReactElement;
  singleComponent?: React.ReactElement;
  leftCornerBackIcon?: boolean;
  leftCornerIcon?: React.ReactElement;
  rightCornerIcon?: React.ReactElement;
  extension?: React.ReactElement;
}

const HeaderMain = ({
  title,
  subtitle,
  singleComponent,
  leftCornerBackIcon = false,
  leftCornerIcon: leftCornerIconProp,
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
        <div className={[styles.SmallText, styles.LightColor].join(" ")}>
          {subtitle}
        </div>
      )}
    </div>
  );

  let leftCornerIcon = leftCornerIconProp;
  if (leftCornerBackIcon) {
    leftCornerIcon = (
      <Icon
        src={BackIcon}
        noLeftMargin
        title={"Back"}
        onClick={handleBackClick}
      />
    );
  }

  return (
    <>
      <div
        className={[styles.HeaderMain, !extension ? styles.Border : ""].join(
          " "
        )}
      >
        <div className={styles.Main}>
          {leftCornerIcon}
          {main}
          {rightCornerIcon && (
            <div className="PushRight">{rightCornerIcon}</div>
          )}
        </div>
      </div>
      {extension && (
        <div className={styles.HeaderExtendedGridArea}>{extension}</div>
      )}
    </>
  );
};

export default HeaderMain;
