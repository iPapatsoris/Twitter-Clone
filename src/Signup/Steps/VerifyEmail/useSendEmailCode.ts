import { useMutation } from "@tanstack/react-query";
import { CreateEmailCode } from "../../../../backend/src/api/email";
import useRequest from "../../../util/hooks/requests/useRequest";

const useSendEmailCode = (key: string) => {
  const { postData } = useRequest();
  return useMutation<
    CreateEmailCode["response"],
    unknown,
    CreateEmailCode["request"]
  >(async (body) => postData("email/code", body));
};

export default useSendEmailCode;
