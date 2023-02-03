export type User = {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  avatar: string;
  coverPic: string;
  isVerified: boolean;
  bio?: string;
  location?: string;
  website?: string;
  birthDate: string;
  joinedDate: string;
  phone: string;
  totalFollowers: number;
  totalFollowees: number;
  totalTweets: number;
};
