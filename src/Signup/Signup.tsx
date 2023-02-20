import Button from "../util/components/Button/Button";
import Dropdown from "../util/components/Dropdown/Dropdown";
import Input from "../util/components/Input/Input";
import styles from "./Signup.module.scss";
import {
  getDaysInMonth,
  getMonths,
  getYears,
  isInvalidDate,
} from "../util/date";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
interface SignupProps {}

type Option = React.ComponentProps<typeof Dropdown>["options"][0];

const Signup = ({}: SignupProps) => {
  const [month, setMonth] = useState(-1);
  const [day, setDay] = useState(-1);
  const [year, setYear] = useState(-1);

  const months: Option[] = getMonths().map((m) => ({
    id: m.id,
    component: <span>{m.text}</span>,
    onSelect: () => {
      setMonth(m.id);
      if (isInvalidDate({ day, year, month: m.id })) {
        setDay(-1);
      }
    },
  }));

  const days: Option[] = getDaysInMonth({ month, year }).map((d) => ({
    id: d.id,
    component: <span>{d.text}</span>,
    onSelect: () => {
      setDay(d.id);
    },
  }));

  const years: Option[] = getYears().map((y) => ({
    id: y.id,
    component: <span>{y.text}</span>,
    onSelect: () => {
      setYear(y.id);
      if (isInvalidDate({ day, year: y.id, month })) {
        setDay(-1);
      }
    },
  }));

  return (
    <div className={styles.Signup}>
      <h1>Create your account</h1>
      <div className={styles.Form}>
        <div className={styles.NameEmail}>
          <Input placeholder="Name" characterLimit={50} />
          <Input placeholder="Email" />
        </div>
        <div>
          <h4>Date of birth</h4>
          <div className={styles.DateOfBirth}>
            This will not be shown publicly. Confirm your own age, even if this
            account is for a business, a pet, or something else.
          </div>
          <div className={styles.Dropdowns}>
            <Dropdown
              name="Month"
              options={months}
              selectedOptionID={month !== -1 ? month : null}
              extraStyles={[styles.Dropdown]}
              position="bottom"
            />
            <Dropdown
              name="Day"
              options={days}
              selectedOptionID={day !== -1 ? day : null}
              extraStyles={[styles.Dropdown]}
              position="top"
            />
            <Dropdown
              name="Year"
              options={years}
              selectedOptionID={year !== -1 ? year : null}
              extraStyles={[styles.Dropdown]}
              position="top"
            />
          </div>
        </div>
      </div>
      <Button
        size="large"
        largeFont
        extraClasses={[styles.Button]}
        color="black"
      >
        Next
      </Button>
    </div>
  );
};

export default Signup;
