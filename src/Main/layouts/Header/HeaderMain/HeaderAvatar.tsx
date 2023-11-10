import { useState } from "react";
import Modal from "../../../../util/components/Modal/Modal";
import MobileSidepanel from "../../../../Sidebar/MobileSidepanel";
import Avatar from "../../../routes/Profile/ProfileFace/Avatar/Avatar";
import { useLoggedInUser } from "../../../../store/AuthStore";

const HeaderAvatar = () => {
  const [showMobileSidePanel, setShowMobileSidePanel] = useState(false);
  const loggedInUser = useLoggedInUser();
  return (
    <>
      {showMobileSidePanel && (
        <Modal isSidePanel setIsActive={setShowMobileSidePanel}>
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
