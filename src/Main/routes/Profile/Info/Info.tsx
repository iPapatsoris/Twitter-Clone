import { ExposedUser } from "../../../../../backend/src/api/user";
import { RequestFields } from "../Profile";
import IconAndText from "./IconAndText";
import styles from "./Info.module.scss";
import locationIcon from "../../../../assets/icons/location.png";
import birthdayIcon from "../../../../assets/icons/birthday.png";
import dateIcon from "../../../../assets/icons/date.png";
import websiteIcon from "../../../../assets/icons/website.png";
import dayjs from "dayjs";

interface InfoProps {
  user: Pick<ExposedUser, RequestFields>;
}

const Info = ({ user }: InfoProps) => {
  const infoArray = [];

  if (user.location) {
    infoArray.push(<IconAndText icon={locationIcon} text={user.location} />);
  }
  if (user.website) {
    infoArray.push(<IconAndText icon={websiteIcon} link={user.website} />);
  }
  if (user.birthDate) {
    infoArray.push(
      <IconAndText
        icon={birthdayIcon}
        text={"Born " + dayjs(user.birthDate).format("MMMM D")}
      />
    );
  }
  if (user.joinedDate) {
    infoArray.push(
      <IconAndText
        icon={dateIcon}
        text={"Joined " + dayjs(user.joinedDate).format("MMMM YYYY")}
      />
    );
  }

  return <div className={styles.Info}>{infoArray}</div>;
};

export default Info;
