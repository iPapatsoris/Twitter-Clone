import Button from "../../../util/components/Button/Button";
import UserCard, {
  UserCardDetails,
} from "../../../util/components/UserCard/UserCard";

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
