import styles from "./ProfileButton.module.scss";
import { ReactComponent as Dots } from "../../assets/icons/dots.svg";
import Icon from "../../util/components/Icon/Icon";
import OptionsPopup from "../../util/components/Popup/OptionsPopup/OptionsPopup";
import { useRef, useState } from "react";
import { OptionWithNested } from "../../util/components/Popup/OptionsPopup/Option";
import { useMutation } from "@tanstack/react-query";
import { NormalResponse } from "../../../backend/src/api/common";
import { useAuthStore } from "../../store/AuthStore";
import { deleteData } from "../../util/request";
import Profile from "../../Main/routes/Profile/Profile";
import useWindowDimensions from "../../util/hooks/useWindowDimensions";

const ProfileButton = () => {
  const [showOptions, setShowOptions] = useState(false);
  const { isPcBig } = useWindowDimensions();

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
            isFixed: true,
          }}
        />
      )}
      <div
        onClick={() => {
          setShowOptions(true);
        }}
        className={[styles.ProfileButton, styles.NoHighlighting].join(" ")}
      >
        <div className={styles.Wrapper} ref={profileButtonRef}>
          <Profile
            preview={{
              username: user.username,
              type: "user-list",
              noNavOnClick: true,
              noPreviewOnHover: true,
              iconAction: (
                <Icon src={Dots} title="" hover="none" alt="Account options" />
              ),
              showJustAvatar: !isPcBig,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ProfileButton;
