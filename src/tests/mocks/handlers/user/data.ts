import { useLoggedInUser } from "../../../../store/AuthStore";

const loggedInUser: ReturnType<typeof useLoggedInUser> = {
  id: 1,
  name: "Mocked User",
  username: "mocked-user-123",
};

const userTestData = {
  loggedInUser,
};

export default userTestData;
