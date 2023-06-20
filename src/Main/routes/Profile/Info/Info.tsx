import IconAndText from "./IconAndText";
import styles from "./Info.module.scss";
import locationIcon from "../../../../assets/icons/location.png";
import birthdayIcon from "../../../../assets/icons/birthday.png";
import dateIcon from "../../../../assets/icons/date.png";
import websiteIcon from "../../../../assets/icons/website.png";
import dayjs from "dayjs";
import { UserProfileT } from "../queries";

interface InfoProps {
  user: UserProfileT;
}

const Info = ({ user }: InfoProps) => {
  const infoArray = [];

  if (user.location) {
    infoArray.push(
      <IconAndText key="location" icon={locationIcon} text={user.location} />
    );
  }
  if (user.website) {
    infoArray.push(
      <IconAndText key="website" icon={websiteIcon} link={user.website} />
    );
  }
  if (user.birthDate) {
    infoArray.push(
      <IconAndText
        key="birthDate"
        icon={birthdayIcon}
        text={"Born " + dayjs(user.birthDate).format("MMMM D")}
      />
    );
  }
  if (user.joinedDate) {
    infoArray.push(
      <IconAndText
        key="joinedDate"
        icon={dateIcon}
        text={"Joined " + dayjs(user.joinedDate).format("MMMM YYYY")}
      />
    );
  }

  return <div className={styles.Info}>{infoArray}</div>;
};

export default Info;
