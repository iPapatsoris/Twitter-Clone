import { useQuery } from "@tanstack/react-query";
import Trend from "./Trend";
import { trendsKeys } from "./queries";

const Trends = () => {
  const { data, isSuccess } = useQuery({
    ...trendsKeys.trends(),
    staleTime: 120000,
  });

  if (!isSuccess) {
    return null;
  }

  const trends = data!.trends.map((trend) => (
    <Trend key={trend.trend + trend.tweets} trend={trend} />
  ));

  return <>{trends}</>;
};

export default Trends;
