import { ReactElement, useRef, useState } from "react";
import styles from "./MoreOptionsNavItem.module.scss";
import OptionsPopup from "../../../util/components/Popup/OptionsPopup/OptionsPopup";
import { navMoreOptionsList } from "./navMoreOptionsList";

interface MoreOptionsNavItemProps {
  children: ReactElement;
}

const MoreOptionsNavItem = ({ children }: MoreOptionsNavItemProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const popupTargetAreaRef = useRef(null);

  return (
    <>
      <div ref={popupTargetAreaRef} onClick={() => setShowOptions(true)}>
        {children}
      </div>
      {showOptions && popupTargetAreaRef && (
        <OptionsPopup
          options={navMoreOptionsList}
          popupProps={{
            setIsActive: setShowOptions,
            targetAreaRef: popupTargetAreaRef,
            autoMaxHeight: true,
            extraPopupStyles: [styles.PopupStyles],
            isFixed: true,
          }}
        />
      )}
    </>
  );
};

export default MoreOptionsNavItem;
