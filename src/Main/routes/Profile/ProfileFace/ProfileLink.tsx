import LinkCondition from "../../../../util/components/LinkCondition/LinkCondition";
import { getPagePath } from "../../../../util/paths";
import { ProfileProps } from "../Profile";
import styles from "../Profile.module.scss";

interface ProfileLinkProps {
  preview: ProfileProps["preview"];
  username: string;
  children: JSX.Element;
}

const ProfileLink = ({ children, preview, username }: ProfileLinkProps) => (
  <LinkCondition
    condition={!preview || preview.noNavOnClick}
    linkProps={{
      to: getPagePath("profile", username),
      className: styles.Semantic,
    }}
  >
    {children}
  </LinkCondition>
);

export default ProfileLink;
