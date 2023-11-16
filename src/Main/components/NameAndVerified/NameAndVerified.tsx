import Icon from "../../../util/components/Icon/Icon";
import { ReactComponent as VerifiedIcon } from "../../../assets/icons/verified.svg";
import styles from "./NameAndVerified.module.scss";

interface NameAndVerifiedProps {
  name: string;
  isVerified: boolean;
  size: "big" | "small";
  underlineNameOnHover?: boolean;
}

const NameAndVerified = ({
  name,
  isVerified,
  size,
  underlineNameOnHover = false,
}: NameAndVerifiedProps) => (
  <div
    className={[styles.NameAndVerified, size === "big" ? styles.Big : ""].join(
      " "
    )}
  >
    <span
      className={[
        styles.BigText,
        styles.Bold,
        underlineNameOnHover ? styles.UnderlineOnHover : "",
      ].join(" ")}
    >
      {name}
    </span>
    {isVerified ? (
      <Icon src={VerifiedIcon} hover="none" noCursorPointer />
    ) : null}
  </div>
);

export default NameAndVerified;
