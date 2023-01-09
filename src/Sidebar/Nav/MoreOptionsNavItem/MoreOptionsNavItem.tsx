import { ReactElement, useContext, useState } from "react";
import styles from "./MoreOptionsNavItem.module.scss";
import OptionsPopup, {
  activatePopupHandler,
} from "../../../util/components/OptionsPopup/OptionsPopup";
import { navMoreOptionsList } from "./navMoreOptionsList";
import { PopupContext } from "../../../App";

interface MoreOptionsNavItemProps {
  navItem: ReactElement;
}

const MoreOptionsNavItem = ({ navItem }: MoreOptionsNavItemProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const { setDisableOuterPointerEvents } = useContext(PopupContext);
  // TODO: fix event TS
  const onClick = (e: any) => {
    activatePopupHandler({
      e,
      isActivePopup: showOptions,
      setIsActivePopup: setShowOptions,
      setDisableOuterPointerEvents,
    });
  };

  return (
    <>
      <div onClick={onClick}>{navItem}</div>
      {showOptions && (
        <div className={styles.NoFlexItem}>
          <OptionsPopup
            options={navMoreOptionsList}
            setIsActive={setShowOptions}
          />
        </div>
      )}
    </>
  );
};

export default MoreOptionsNavItem;
