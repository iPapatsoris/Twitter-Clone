import { createQueryKeys } from "@lukemorales/query-key-factory";
import { getData } from "../../../util/request";
import { GetTrends } from "../../../../backend/src/api/tweet";

export const trendsKeys = createQueryKeys("trends", {
  trends: () => ({
    queryKey: ["trends"],
    queryFn: trendsQuery,
  }),
});

const trendsQuery = async () => {
  const res = await getData<GetTrends["response"]>("tweet/trending");

  if (!res.ok) {
    throw new Error();
  }

  return res.data;
};
