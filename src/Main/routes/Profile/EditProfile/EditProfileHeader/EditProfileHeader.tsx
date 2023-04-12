import Button from "../../../../../util/components/Button/Button";
import Icon from "../../../../../util/components/Icon/Icon";
import styles from "./EditProfileHeader.module.scss";
import closeIcon from "../../../../../assets/icons/close.png";
import { useContext } from "react";
import { ModalContext } from "../../../../../util/components/Modal/Modal";

interface EditProfileHeaderProps {}

const EditProfileHeader = ({}: EditProfileHeaderProps) => {
  const { setIsActive } = useContext(ModalContext);
  return (
    <>
      <Icon
        src={closeIcon}
        extraWrapperStyles={[styles.Icon]}
        onClick={() => setIsActive(false)}
        exactPlacement
      />
      <div className={styles.Header}>
        <h2 className={styles.Text}>Edit profile</h2>
        <Button extraClasses={[styles.Action]} color="black">
          Save
        </Button>
      </div>
    </>
  );
};

export default EditProfileHeader;
