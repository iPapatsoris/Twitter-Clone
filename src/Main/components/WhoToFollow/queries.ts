import { createQueryKeys } from "@lukemorales/query-key-factory";
import { FullProfileRequestFields } from "../../routes/Profile/ProfileFace/queries";
import { addQueryParams, getData } from "../../../util/request";
import { GetUserFolloweeSuggestions } from "../../../../backend/src/api/user";

export const whoToFollowKeys = createQueryKeys("whoToFollow", {
  fields: (fields: readonly FullProfileRequestFields[]) => ({
    queryKey: [fields],
    queryFn: () => whoToFollowQuery(fields),
  }),
});

const whoToFollowQuery = async <T extends Readonly<FullProfileRequestFields[]>>(
  fieldsToQuery: T
) => {
  const res = await getData<GetUserFolloweeSuggestions<T[number]>["response"]>(
    "user/followees/suggestions",
    addQueryParams(fieldsToQuery)
  );

  if (!res.ok) {
    throw new Error();
  }
  return res.data;
};
