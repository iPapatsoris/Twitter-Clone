import Icon from "../../../util/components/Icon/Icon";
import { ReactComponent as VerifiedIcon } from "../../../assets/icons/verified.svg";
import styles from "./NameAndVerified.module.scss";

interface NameAndVerifiedProps {
  name: string;
  isVerified: boolean;
  underlineNameOnHover?: boolean;
  cursorPointerOnVerifiedHover?: boolean;
  abbreviateOverflow?: boolean;
  nameStyles?: string[];
}

const NameAndVerified = ({
  name,
  isVerified,
  underlineNameOnHover = false,
  abbreviateOverflow = true,
  cursorPointerOnVerifiedHover = true,
  nameStyles = [],
}: NameAndVerifiedProps) => (
  <div
    className={[
      styles.NameAndVerified,
      abbreviateOverflow ? styles.AbbreviateOverflow : "",
    ].join(" ")}
  >
    <span
      className={[
        styles.BigText,
        styles.Bold,
        underlineNameOnHover ? styles.UnderlineOnHover : "",
        styles.Name,
        ...nameStyles,
      ].join(" ")}
    >
      {name}
    </span>
    {isVerified ? (
      <Icon
        src={VerifiedIcon}
        hover="none"
        noCursorPointer={!cursorPointerOnVerifiedHover}
        size={17}
        extraWrapperStyles={[styles.VerifiedIcon]}
      />
    ) : null}
  </div>
);

export default NameAndVerified;
