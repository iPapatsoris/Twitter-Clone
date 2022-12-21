import UserCard, { UserCardDetails } from "../../../util/UserCard/UserCard";
import "./WhoToFollowItem.scss";

const WhoToFollowItem = (props: UserCardDetails) => {
  return (
    <UserCard {...props}>
      <button className="WhoToFollowButton">Follow</button>
    </UserCard>
  );
};

export default WhoToFollowItem;
