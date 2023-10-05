import { useState } from "react";
import Modal from "../../../../util/components/Modal/Modal";
import MobileSidepanel from "../../../../Sidebar/MobileSidepanel";
import Avatar from "../../../routes/Profile/ProfileFace/Avatar/Avatar";
import { useAuthStore } from "../../../../store/AuthStore";

interface HeaderAvatarProps {}

const HeaderAvatar = ({}: HeaderAvatarProps) => {
  const [showMobileSidePanel, setShowMobileSidePanel] = useState(false);
  const { loggedInUser } = useAuthStore();
  return (
    <>
      {showMobileSidePanel && (
        <Modal
          isSidePanel
          setIsActive={setShowMobileSidePanel}
          withCloseIcon={false}
        >
          <MobileSidepanel />
        </Modal>
      )}
      <Avatar
        size="tiny"
        src={loggedInUser?.avatar}
        onClick={() => setShowMobileSidePanel(true)}
      />
    </>
  );
};

export default HeaderAvatar;
