import { LoaderFunctionArgs } from "react-router-dom";
import { GetUser } from "../../../../backend/src/api/user";
import { GetUserFields } from "../../../../backend/src/permissions";
import { QueryClient, UseQueryOptions } from "@tanstack/react-query";
import useRequest from "../../../util/hooks/requests/useRequest";

// Fields to query in small preview mode
export const smallPreviewProfileFields = [
  "avatar",
  "bio",
  "id",
  "isVerified",
  "name",
  "username",
  "isFollowedByActiveUser",
] as const satisfies Readonly<Array<GetUserFields>>;

// Fields to query in medium preview mode
export const mediumPreviewProfileFields = [
  ...smallPreviewProfileFields,
  "totalFollowees",
  "totalFollowers",
] as const satisfies Readonly<Array<GetUserFields>>;

// Fields to query in full profile mode
export const fullProfileFields = [
  ...mediumPreviewProfileFields,
  "birthDate",
  "joinedDate",
  "coverPic",
  "location",
  "totalTweets",
  "website",
] as const satisfies Readonly<Array<GetUserFields>>;

type FullProfileRequestFields = typeof fullProfileFields[number];
export type SmallProfileRequestFields =
  typeof smallPreviewProfileFields[number];
type FullProfileResponse = GetUser<FullProfileRequestFields>["response"];

// User prop passed to EditProfile
export type UserProfileT = NonNullable<FullProfileResponse["data"]>["user"];

export const getProfileQueryKey = <T extends Readonly<Array<GetUserFields>>>(
  username: string,
  fieldsToQuery: T
) => ["userProfile", username, ...fieldsToQuery];

// Get specific user profile information, according to fieldsToQuery.
// Type safety ensures that the query result's properties will be limited only
// to the ones mentioned on fieldsToQuery.
export const getProfileQuery = <T extends Readonly<Array<GetUserFields>>>(
  username: string,
  getData: ReturnType<typeof useRequest>["getData"],
  fieldsToQuery: T,
  enabled = true
): UseQueryOptions<FullProfileResponse> => ({
  queryKey: getProfileQueryKey(username, fieldsToQuery),
  queryFn: async () => {
    const res = await getData<GetUser<T[number]>["response"], T[number]>(
      "user/" + username,
      fieldsToQuery
    );

    if (!res.ok) {
      throw new Error();
    }
    return res;
  },
  enabled,
});

// On profile load from URL, fetch the full profile
export const profileLoader =
  (
    getData: ReturnType<typeof useRequest>["getData"],
    queryClient: QueryClient
  ) =>
  async ({ params }: LoaderFunctionArgs) => {
    const query = getProfileQuery(params.username!, getData, fullProfileFields);
    const data = await queryClient.ensureQueryData<
      FullProfileResponse,
      unknown,
      FullProfileResponse,
      any
    >({ queryKey: query.queryKey, queryFn: query.queryFn });
    return data;
  };
