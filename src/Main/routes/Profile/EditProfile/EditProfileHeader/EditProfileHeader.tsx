import Button from "../../../../../util/components/Button/Button";
import Icon from "../../../../../util/components/Icon/Icon";
import styles from "./EditProfileHeader.module.scss";
import closeIcon from "../../../../../assets/icons/close.png";
import { useContext } from "react";
import { ModalContext } from "../../../../../util/components/Modal/Modal";

interface EditProfileHeaderProps {
  disableUpdate: boolean;
}

const EditProfileHeader = ({ disableUpdate }: EditProfileHeaderProps) => {
  const { setIsActive } = useContext(ModalContext);
  return (
    <>
      <Icon
        src={closeIcon}
        extraWrapperStyles={[styles.Icon]}
        onClick={() => setIsActive(false)}
      />
      <div className={styles.Header}>
        <h2 className={styles.Text}>Edit profile</h2>
        <Button
          extraClasses={[styles.Action]}
          color="black"
          type="submit"
          disabled={disableUpdate}
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default EditProfileHeader;
