import UserCard from "../../util/components/UserCard/UserCard";
import styles from "./ProfileButton.module.scss";
import avatar from "../../assets/cats/cat2.jpg";
import dots from "../../assets/icons/dots.png";
import Icon from "../../util/components/Icon/Icon";
import OptionsPopup, {
  activatePopupHandler,
} from "../../util/components/OptionsPopup/OptionsPopup";
import { useContext, useRef, useState } from "react";
import { OptionProps } from "../../util/components/OptionsPopup/Option";
import { PopupContext } from "../../App";

const ProfileButton = () => {
  const [showOptions, setShowOptions] = useState(false);
  const { setDisableOuterPointerEvents } = useContext(PopupContext);
  // TODO: Correct TS for event
  const onClick = (e: any) => {
    activatePopupHandler({
      e,
      isActivePopup: showOptions,
      setIsActivePopup: setShowOptions,
      setDisableOuterPointerEvents,
    });
  };

  const options: Array<OptionProps> = [
    {
      mainOption: { component: "Add an existing account", id: "addAccount" },
    },
    {
      mainOption: { component: "Logout @toulouse-cat", id: "logout" },
    },
  ];

  const profileButtonRef = useRef(null);

  return (
    <div
      ref={profileButtonRef}
      onClick={onClick}
      className={[styles.ProfileButton, styles.NoHighlighting].join(" ")}
    >
      {showOptions && (
        <OptionsPopup
          options={options}
          setIsActive={setShowOptions}
          isActive={showOptions}
          targetAreaRef={profileButtonRef}
          position="top"
          extraStyles={[styles.PopupStyles]}
        />
      )}
      <UserCard
        name="Toulouse"
        username="toulouse-cat"
        avatar={avatar}
        isStandalone
      >
        <Icon src={dots} title="" hoverBg="none" alt="Account options" />
      </UserCard>
    </div>
  );
};

export default ProfileButton;
