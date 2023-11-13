import { useMutation } from "@tanstack/react-query";
import { CreateEmailCode } from "../../../../backend/src/api/email";
import { postData } from "../../../util/request";

const useSendEmailCode = (key: string) => {
  return useMutation<
    CreateEmailCode["response"],
    unknown,
    CreateEmailCode["request"]
  >({ mutationFn: async (body) => postData("email/code", body) });
};

export default useSendEmailCode;
