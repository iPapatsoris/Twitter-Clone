import { useQuery, useQueryClient } from "@tanstack/react-query";
import { whoToFollowKeys } from "./queries";
import Profile from "../../routes/Profile/Profile";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const WhoToFollow = () => {
  const queryClient = useQueryClient();
  const location = useLocation();

  useEffect(() => {
    queryClient.invalidateQueries(whoToFollowKeys._def);
  }, [location, queryClient]);

  const { data, isSuccess } = useQuery(
    whoToFollowKeys.fields([
      "avatar",
      "name",
      "username",
      "isFollowedByActiveUser",
      "id",
    ])
  );

  if (!isSuccess) {
    return null;
  }

  return (
    <>
      {data.data?.followeeSuggestions.map((user) => (
        <Profile
          key={user.id}
          preview={{ size: "small", username: user.username, noBio: true }}
        />
      ))}
    </>
  );
};

export default WhoToFollow;
