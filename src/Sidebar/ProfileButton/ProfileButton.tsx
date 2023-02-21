import UserCard from "../../util/components/UserCard/UserCard";
import styles from "./ProfileButton.module.scss";
import avatar from "../../assets/cats/cat2.jpg";
import dots from "../../assets/icons/dots.png";
import Icon from "../../util/components/Icon/Icon";
import OptionsPopup, {
  activatePopupHandler,
} from "../../util/components/OptionsPopup/OptionsPopup";
import { useContext, useRef, useState } from "react";
import { PopupContext } from "../../App";
import { OptionWithNested } from "../../util/components/OptionsPopup/Option";

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

  const options: Array<OptionWithNested> = [
    {
      mainOption: {
        component: "Add an existing account",
        id: 1,
        onSelect: () => {},
      },
    },
    {
      mainOption: {
        component: "Logout @toulouse-cat",
        id: 2,
        onSelect: () => {},
      },
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
          extraPopupStyles={[styles.PopupStyles]}
        />
      )}
      <UserCard
        name="Toulouse"
        username="toulouse-cat"
        avatar={avatar}
        isStandalone
      >
        <Icon src={dots} title="" hover="none" alt="Account options" />
      </UserCard>
    </div>
  );
};

export default ProfileButton;
