import IconAndText from "./IconAndText";
import styles from "./Info.module.scss";
import {ReactComponent as LocationIcon} from "../../../../../assets/icons/location.svg";
import {ReactComponent as birthdayIcon }from "../../../../../assets/icons/birthday.svg";
import {ReactComponent as DateIcon }from "../../../../../assets/icons/date.svg";
import {ReactComponent as WebsiteIcon }from "../../../../../assets/icons/website.svg";
import dayjs from "dayjs";
import { UserProfileT } from "../queries";

interface InfoProps {
  user: UserProfileT;
}

const Info = ({ user }: InfoProps) => {
  const infoArray = [];

  if (user.location) {
    infoArray.push(
      <IconAndText key="location" icon={LocationIcon} text={user.location} />
    );
  }
  if (user.website) {
    infoArray.push(
      <IconAndText key="website" icon={WebsiteIcon} link={user.website} />
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
        icon={DateIcon}
        text={"Joined " + dayjs(user.joinedDate).format("MMMM YYYY")}
      />
    );
  }

  return <div className={styles.Info}>{infoArray}</div>;
};

export default Info;
