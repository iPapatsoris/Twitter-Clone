/* eslint-disable no-multi-str */
import { faker } from "@faker-js/faker";
import { capitalizeFirstLetter, getRandomInt, runQuery } from "../../util.js";
import { PopulateOptions } from "./populate.js";
import { charLimits } from "../../api/user.js";
import dayjs from "dayjs";
import { User } from "../../entities/user.js";
import { sha256 } from "js-sha256";

type UserT = Omit<
  User,
  | "id"
  | "totalFollowers"
  | "totalFollowees"
  | "totalTweets"
  | "phone"
  | "joinedDate"
>;

const populateUsers = async (populateOptions: PopulateOptions) => {
  console.log("Adding users");

  const { password, totalUsers, coverPicCategories } = populateOptions;

  const passwordHash = sha256(password);
  for (let u = 0; u < totalUsers; u++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = firstName + " " + lastName;
    const user: UserT = {
      name,
      username: (lastName.toLocaleLowerCase() + getRandomInt(100)).substring(
        0,
        15
      ),
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      password: passwordHash,
      avatar: faker.internet.avatar(),
      coverPic: faker.image.urlLoremFlickr({
        category: coverPicCategories[getRandomInt(coverPicCategories.length)],
      }),
      isVerified: !getRandomInt(2),
      bio: capitalizeFirstLetter(faker.person.bio()),
      location: faker.location.country().substring(0, charLimits.location),
      website: faker.internet.url(),
      birthDate: dayjs(faker.date.birthdate()).format("YYYY-MM-DD"),
    };

    await runQuery(
      "INSERT INTO user \
     (username, password, email, name, birthDate, joinedDate, avatar, coverPic,\
      isVerified, bio, location, website) \
     VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?)",
      [
        user.username,
        password,
        user.email,
        user.name,
        user.birthDate,
        user.avatar,
        user.coverPic,
        user.isVerified,
        user.bio,
        user.location,
        user.website,
      ]
    );
  }
};

export default populateUsers;
