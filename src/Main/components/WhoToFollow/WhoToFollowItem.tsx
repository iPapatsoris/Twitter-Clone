import Button from "../../../util/Button/Button";
import UserCard, { UserCardDetails } from "../../../util/UserCard/UserCard";
import "./WhoToFollowItem.scss";

const WhoToFollowItem = (props: UserCardDetails) => {
  return (
    <UserCard {...props}>
      <Button style="small" color="black">
        Follow
      </Button>
    </UserCard>
  );
};

export default WhoToFollowItem;
