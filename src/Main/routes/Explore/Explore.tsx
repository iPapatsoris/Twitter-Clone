// import "./Explore.scss";

import { useQuery } from "react-query";
import { deleteData, getData, postData } from "../../../util/api";
import { GetUser } from "../../../../backend/src/api/user.js";
import { NormalResponse } from "../../../../backend/src/api/common.js";

const Explore = () => {
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

  console.log(dataAuth);
  console.log(logoutData);

  return (
    <div>
      <button onClick={() => testAuth()}>testAuth</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
};

export default Explore;
