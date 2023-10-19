import { SetStateAction } from "react";
import Popup from "../../../../util/components/Popup/Popup";
import Profile from "./ProfileFace";
import useWindowDimensions from "../../../../util/hooks/useWindowDimensions";

interface ProfileHoverPreviewProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  targetAreaRef: React.RefObject<HTMLDivElement>;
  username: string;
}

const ProfileHoverPreview = ({
  isOpen,
  setIsOpen,
  targetAreaRef,
  username,
}: ProfileHoverPreviewProps) => {
  const { isSmallScreen } = useWindowDimensions();

  return !isOpen || isSmallScreen ? null : (
    <Popup
      position={{ block: "bottom", inline: "leftCover" }}
      setIsActive={setIsOpen}
      targetAreaRef={targetAreaRef}
      allowOuterEvents
      disableOnHoverOut
    >
      <Profile
        preview={{
          type: "hover",
          username: username,
          includeBio: true,
        }}
      />
    </Popup>
  );
};

export default ProfileHoverPreview;
