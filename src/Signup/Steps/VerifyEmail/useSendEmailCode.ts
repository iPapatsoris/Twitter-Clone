import { useMutation } from "react-query";
import { CreateEmailCode } from "../../../../backend/src/api/emailCode";
import { postData } from "../../../util/api";

const useSendEmailCode = (key: string) => {
  return useMutation<
    CreateEmailCode["response"],
    unknown,
    CreateEmailCode["request"]
  >(async (body) => postData("emailCode", body));
};

export default useSendEmailCode;
