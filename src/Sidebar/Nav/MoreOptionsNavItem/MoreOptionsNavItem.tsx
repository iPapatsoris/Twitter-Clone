import { ReactElement, useContext, useRef, useState } from "react";
import styles from "./MoreOptionsNavItem.module.scss";
import OptionsPopup, {
  activatePopupHandler,
} from "../../../util/components/OptionsPopup/OptionsPopup";
import { navMoreOptionsList } from "./navMoreOptionsList";
import { PopupContext } from "../../../App";

interface MoreOptionsNavItemProps {
  children: ReactElement;
}

const MoreOptionsNavItem = ({ children }: MoreOptionsNavItemProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const { setDisableOuterPointerEvents } = useContext(PopupContext);
  const popupTargetAreaRef = useRef(null);

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
      <div ref={popupTargetAreaRef} onClick={onClick}>
        {children}
      </div>
      {showOptions && popupTargetAreaRef && (
        <OptionsPopup
          options={navMoreOptionsList}
          isActive={showOptions}
          setIsActive={setShowOptions}
          targetAreaRef={popupTargetAreaRef}
          autoMaxHeight
          extraStyles={[styles.PopupStyles]}
        />
      )}
    </>
  );
};

export default MoreOptionsNavItem;
