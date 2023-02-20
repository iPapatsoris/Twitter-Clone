import dayjs from "dayjs";

// Get last 120 years
export const getYears = () => {
  const currentYear = dayjs().year();
  const earliestYear = currentYear - 120;
  return [...Array(currentYear - earliestYear + 1).keys()].map((y) => ({
    id: currentYear - y,
    text: currentYear - y,
  }));
};

// Get the names of the months in a year
export const getMonths = () =>
  [...Array(12).keys()].map((m) => ({
    id: m,
    text: dayjs().month(m).format("MMMM"),
  }));

/* Get the number of days in a month. Month and year passed as -1 are considered
   unknown, in which case we return the maximum number of days given the
   information that is provided.
*/
export const getDaysInMonth = ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  let daysInMonth;
  if (month === -1) {
    // If month is not specified, assume 31 days
    daysInMonth = 31;
  } else {
    // Month is specified, get days in it.
    // If year is not specified, assume a leap year
    const computedYear = year === -1 ? 2000 : year;
    daysInMonth = dayjs().month(month).year(computedYear).daysInMonth();
  }

  return [...Array(daysInMonth).keys()].map((day) => ({
    id: day + 1,
    text: (day + 1).toString(),
  }));
};

export const isInvalidDate = ({
  day,
  month,
  year,
}: {
  day: number;
  month: number;
  year: number;
}) => {
  return (
    day !== -1 &&
    ((year !== -1 && day > dayjs().month(month).year(year).daysInMonth()) ||
      (year === -1 && day > dayjs().month(month).daysInMonth()))
  );
};
