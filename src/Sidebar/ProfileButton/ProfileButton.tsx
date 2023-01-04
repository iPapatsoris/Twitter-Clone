import UserCard from "../../util/components/UserCard/UserCard";
import styles from "./ProfileButton.module.scss";
import avatar from "../../assets/cats/cat2.jpg";
import dots from "../../assets/icons/dots.png";
import Icon from "../../util/components/Icon/Icon";
import OptionsPopup from "../../util/components/OptionsPopup/OptionsPopup";
import { useState } from "react";
import { OptionProps } from "../../util/components/OptionsPopup/Option";

const ProfileButton = () => {
  const [showOptions, setShowOptions] = useState(false);

  const onClick = () => {
    setShowOptions(!showOptions);
  };

  const options: Array<OptionProps> = [
    {
      mainOption: { component: "Add an existing account", id: "addAccount" },
    },
    {
      mainOption: { component: "Logout @toulouse-cat", id: "logout" },
    },
  ];

  return (
    <div
      onClick={onClick}
      className={[styles.ProfileButton, styles.NoHighlighting].join(" ")}
    >
      <OptionsPopup options={options} isVisible={showOptions} />
      <UserCard
        name="Toulouse"
        username="toulouse-cat"
        avatar={avatar}
        isStandalone
      >
        <Icon src={dots} title="" hoverBg="none" />
      </UserCard>
    </div>
  );
};

export default ProfileButton;
