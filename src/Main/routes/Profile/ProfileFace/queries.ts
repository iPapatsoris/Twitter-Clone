import { LoaderFunctionArgs } from "react-router-dom";
import { GetUser } from "../../../../../backend/src/api/user";
import { GetUserFields } from "../../../../../backend/src/permissions";
import { QueryClient } from "@tanstack/react-query";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { addQueryParams, getData } from "../../../../util/request";

// Fields to query in user-list, tweet-list, tweet-view preview modes
export const smallPreviewProfileFields = [
  "avatar",
  "bio",
  "id",
  "isVerified",
  "name",
  "username",
  "isFollowedByActiveUser",
] as const satisfies Readonly<Array<GetUserFields>>;

// Fields to query in hover preview mode
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

export type FullProfileRequestFields = (typeof fullProfileFields)[number];
export type SmallProfileRequestFields =
  (typeof smallPreviewProfileFields)[number];
type FullProfileResponse = GetUser<FullProfileRequestFields>["response"];

// User prop passed to EditProfile
export type UserProfileT = NonNullable<FullProfileResponse["data"]>["user"];

export const profileKeys = createQueryKeys("userProfile", {
  username: (username: string) => ({
    queryKey: [username],
    contextQueries: {
      fields: <T extends Readonly<FullProfileRequestFields[]>>(fields: T) => ({
        queryKey: [fields as any],
        queryFn: () => profileQuery(username, fields),
      }),
    },
  }),
});

/* Get specific user profile information, according to fieldsToQuery.
   Type safety ensures that the query result's properties will be limited only
   to the ones mentioned on fieldsToQuery.
   
   TODO: If we call profileQuery directly, types work correctly, however
   if we get it through the query-key-factory, the fields are not narrowed down
*/
const profileQuery = async <T extends Readonly<FullProfileRequestFields[]>>(
  username: string,
  fieldsToQuery: T
) => {
  const res = await getData<GetUser<T[number]>["response"]>(
    "user/" + username,
    addQueryParams(fieldsToQuery)
  );

  if (!res.ok) {
    throw new Error();
  }
  return res.data!;
};

// On profile load from URL, fetch the full profile
export const profileLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const { queryKey, queryFn } = profileKeys
      .username(params.username!)
      ._ctx.fields(fullProfileFields);
    const data = await queryClient.fetchQuery({ queryKey, queryFn });
    return data;
  };
