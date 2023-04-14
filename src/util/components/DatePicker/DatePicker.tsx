import { SetStateAction } from "react";
import { getDaysInMonth, getMonths, getYears, isInvalidDate } from "../../date";
import Dropdown from "../Dropdown/Dropdown";
import styles from "./DatePicker.module.scss";

interface DatePickerProps {
  day: number;
  month: number;
  year: number;
  setDay: React.Dispatch<SetStateAction<number>>;
  setMonth: React.Dispatch<SetStateAction<number>>;
  setYear: React.Dispatch<SetStateAction<number>>;
}

const DatePicker = ({
  day,
  month,
  year,
  setMonth,
  setDay,
  setYear,
}: DatePickerProps) => {
  type Option = React.ComponentProps<typeof Dropdown>["options"][0];

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
    <div className={styles.Dropdowns}>
      <Dropdown
        name="Month"
        options={months}
        selectedOptionID={month !== -1 ? month : null}
        extraStyles={[styles.Dropdown]}
        position={{ block: "bottom", inline: "leftCover" }}
      />
      <Dropdown
        name="Day"
        options={days}
        selectedOptionID={day !== -1 ? day : null}
        extraStyles={[styles.Dropdown]}
        position={{ block: "top", inline: "leftCover" }}
      />
      <Dropdown
        name="Year"
        options={years}
        selectedOptionID={year !== -1 ? year : null}
        extraStyles={[styles.Dropdown]}
        position={{ block: "top", inline: "leftCover" }}
      />
    </div>
  );
};

export default DatePicker;
