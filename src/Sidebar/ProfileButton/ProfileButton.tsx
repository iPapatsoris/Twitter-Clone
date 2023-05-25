import UserCard from "../../util/components/UserCard/UserCard";
import styles from "./ProfileButton.module.scss";
import dots from "../../assets/icons/dots.png";
import Icon from "../../util/components/Icon/Icon";
import OptionsPopup from "../../util/components/Popup/OptionsPopup/OptionsPopup";
import { useRef, useState } from "react";
import { OptionWithNested } from "../../util/components/Popup/OptionsPopup/Option";
import { useMutation } from "@tanstack/react-query";
import { NormalResponse } from "../../../backend/src/api/common";
import { useAuthStore } from "../../store/AuthStore";
import { deleteData } from "../../util/request";

const ProfileButton = () => {
  const [showOptions, setShowOptions] = useState(false);

  const profileButtonRef = useRef(null);
  const user = useAuthStore((state) => state.loggedInUser);
  const setUser = useAuthStore((state) => state.setLoggedInUser);
  const { mutate } = useMutation<NormalResponse>(
    ["logout"],
    () => deleteData("auth/logout"),
    {
      onSuccess: (data) => {
        if (data.ok) {
          setUser(null);
        }
      },
    }
  );

  if (!user) return null;

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
        component: "Logout @" + user.username,
        id: 2,
        onSelect: mutate,
      },
    },
  ];

  return (
    <>
      {showOptions && (
        <OptionsPopup
          options={options}
          popupProps={{
            setIsActive: setShowOptions,
            targetAreaRef: profileButtonRef,
            position: { block: "top", inline: "leftCover" },
            extraPopupStyles: [styles.PopupStyles],
          }}
        />
      )}
      <div
        ref={profileButtonRef}
        onClick={() => {
          setShowOptions(true);
        }}
        className={[styles.ProfileButton, styles.NoHighlighting].join(" ")}
      >
        <UserCard
          name={user.name}
          username={user.username}
          avatar={user.avatar}
          isStandalone
        >
          <Icon src={dots} title="" hover="none" alt="Account options" />
        </UserCard>
      </div>
    </>
  );
};

export default ProfileButton;
