import { SetStateAction } from "react";
import Popup from "../../../util/components/Popup/Popup";
import Profile from "./Profile";

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
}: ProfileHoverPreviewProps) =>
  !isOpen ? null : (
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

export default ProfileHoverPreview;
