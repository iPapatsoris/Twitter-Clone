import { useParams } from "react-router-dom";
import HeaderLinkMenu from "../../../layouts/Header/HeaderMain/HeaderMainExtension/HeaderLinkMenu/HeaderLinkMenu";

const HeaderExtendedCircle = () => {
  const { username } = useParams();
  return (
    <HeaderLinkMenu
      items={[
        { page: "following", username, title: "Following" },
        { page: "followers", username, title: "Followers" },
      ]}
    />
  );
};

export default HeaderExtendedCircle;
