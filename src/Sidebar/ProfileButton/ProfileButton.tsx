import UserCard from "../../util/components/UserCard/UserCard";
import styles from "./ProfileButton.module.scss";
import avatar from "../../assets/cats/cat2.jpg";
import dots from "../../assets/icons/dots.png";
import Icon from "../../util/components/Icon/Icon";
import OptionsPopup from "../../util/components/OptionsPopup/OptionsPopup";
import { useRef, useState } from "react";
import { OptionWithNested } from "../../util/components/OptionsPopup/Option";

const ProfileButton = () => {
  const [showOptions, setShowOptions] = useState(false);

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
      onClick={() => setShowOptions(true)}
      className={[styles.ProfileButton, styles.NoHighlighting].join(" ")}
    >
      {showOptions && (
        <OptionsPopup
          options={options}
          setIsActive={setShowOptions}
          isActive={showOptions}
          targetAreaRef={profileButtonRef}
          position={{ block: "top", inline: "leftCover" }}
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
