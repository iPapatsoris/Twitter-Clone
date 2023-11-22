import { useState } from "react";
import Modal from "../../../../util/components/Modal/Modal";
import MobileSidepanel from "../../../../Sidebar/MobileSidepanel";
import Avatar from "../../../routes/Profile/ProfileFace/Avatar/Avatar";
import { useLoggedInUser } from "../../../../store/AuthStore";
import { useQueryClient } from "@tanstack/react-query";
import {
  mediumPreviewProfileFields,
  profileKeys,
} from "../../../routes/Profile/ProfileFace/queries";

const HeaderAvatar = () => {
  const [showMobileSidePanel, setShowMobileSidePanel] = useState(false);
  const loggedInUser = useLoggedInUser();

  const queryClient = useQueryClient();

  const onAvatarClick = async () => {
    await queryClient.ensureQueryData(
      profileKeys
        .username(loggedInUser!.username)
        ._ctx.fields(mediumPreviewProfileFields)
    );
    setShowMobileSidePanel(true);
  };
  return (
    <>
      {showMobileSidePanel && (
        <Modal isSidePanel setIsActive={setShowMobileSidePanel}>
          <MobileSidepanel />
        </Modal>
      )}
      <Avatar size="tiny" src={loggedInUser?.avatar} onClick={onAvatarClick} />
    </>
  );
};

export default HeaderAvatar;
