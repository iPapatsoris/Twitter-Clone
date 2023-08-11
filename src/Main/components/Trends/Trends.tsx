import { useQuery } from "@tanstack/react-query";
import Trend from "./Trend";
import { trendsKeys } from "./queries";

const Trends = () => {
  const { data, isSuccess } = useQuery(trendsKeys.trends());

  if (!isSuccess) {
    return null;
  }

  return data.data?.trends.map((trend) => (
    <Trend key={trend.trend + trend.tweets} trend={trend} />
  ));
};

export default Trends;
