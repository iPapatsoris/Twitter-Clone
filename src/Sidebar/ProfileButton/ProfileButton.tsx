import styles from "./ProfileButton.module.scss";
import { ReactComponent as Dots } from "../../assets/icons/dots.svg";
import Icon from "../../util/components/Icon/Icon";
import OptionsPopup from "../../util/components/Popup/OptionsPopup/OptionsPopup";
import { useRef, useState } from "react";
import { OptionWithNested } from "../../util/components/Popup/OptionsPopup/Option";
import { useAuthStore, useLogoutMutation } from "../../store/AuthStore";
import Profile from "../../Main/routes/Profile/Profile";
import useWindowDimensions from "../../util/hooks/useWindowDimensions";

const ProfileButton = () => {
  const [showOptions, setShowOptions] = useState(false);
  const { isPcBig } = useWindowDimensions();

  const profileButtonRef = useRef(null);
  const user = useAuthStore((state) => state.loggedInUser);
  const { mutate: logout } = useLogoutMutation();

  if (!user) return null;

  const options: Array<OptionWithNested> = [
    {
      mainOption: {
        component: "Add an existing account",
        id: "add-account",
        onSelect: () => {},
      },
    },
    {
      mainOption: {
        component: "Logout @" + user.username,
        id: "logout",
        onSelect: logout,
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
