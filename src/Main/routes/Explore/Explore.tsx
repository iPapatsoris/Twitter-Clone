// import "./Explore.scss";
import { LoginUser } from "../../../../backend/src/api/auth.js";

import { useQuery } from "react-query";
import { deleteData, getData, postData } from "../../../util/api";
import { GetUser } from "../../../../backend/src/api/user.js";
import { NormalResponse } from "../../../../backend/src/api/common.js";

const Explore = () => {
  const { refetch, data } = useQuery<LoginUser["response"]>(
    ["login"],
    () => {
      return postData<LoginUser["request"]>("auth/login", {
        user: {
          email: "my-email.com",
          password: "12345678",
        },
      });
    },
    { enabled: false }
  );

  const { refetch: logout, data: logoutData } = useQuery<NormalResponse>(
    ["logout"],
    () => {
      return deleteData("auth/logout");
    },
    { enabled: false }
  );

  const { refetch: testAuth, data: dataAuth } = useQuery<GetUser["response"]>(
    ["testAuth"],
    () => {
      return getData("user/1?name");
    },
    { enabled: false }
  );

  console.log(data);
  console.log(dataAuth);
  console.log(logoutData);

  return (
    <div>
      Explore page<button onClick={() => refetch()}>login</button>
      <button onClick={() => testAuth()}>testAuth</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
};

export default Explore;
