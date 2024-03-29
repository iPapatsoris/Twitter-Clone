import { useQuery, useQueryClient } from "@tanstack/react-query";
import { whoToFollowKeys } from "./queries";
import Profile from "../../routes/Profile/Profile";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getPagePath } from "../../../util/paths";

const WhoToFollow = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: whoToFollowKeys._def });
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
      {data?.followeeSuggestions.map((user) => (
        <div
          key={user.id}
          onClick={() => navigate(getPagePath("profile", user.username))}
        >
          <Profile
            key={user.id}
            preview={{
              type: "user-list",
              username: user.username,
            }}
          />
        </div>
      ))}
    </>
  );
};

export default WhoToFollow;
