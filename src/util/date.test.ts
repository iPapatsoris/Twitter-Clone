import { expect, test } from "vitest";
import { getDaysInMonth, isInvalidDate } from "./date";

const sameDateArrays =
  (b: number[]) => (a: ReturnType<typeof getDaysInMonth>) => {
    if (a.length !== b.length) {
      return false;
    }

    return a.every((item, index) => item.id === b[index]);
  };

const getMonthWithNDays = (days: number) => {
  const month: number[] = Array(days);
  for (let d = 0; d < month.length; d++) {
    month[d] = d + 1;
  }

  return month;
};

const monthWith31Days: number[] = getMonthWithNDays(31);
const monthWith28Days: number[] = getMonthWithNDays(28);
const monthWith29Days: number[] = getMonthWithNDays(29);

test("days in unknown month and year", () => {
  const res = getDaysInMonth({ month: -1, year: -1 });
  expect(res).toSatisfy(sameDateArrays(monthWith31Days));
});

test("days in unknown month of non-leap year", () => {
  const res = getDaysInMonth({ month: -1, year: 2025 });
  expect(res).toSatisfy(sameDateArrays(monthWith31Days));
});

test("days in unknown month of leap year", () => {
  const res = getDaysInMonth({ month: -1, year: 2024 });
  expect(res).toSatisfy(sameDateArrays(monthWith31Days));
});

test("days in February of unknown year", () => {
  const res = getDaysInMonth({ month: 1, year: -1 });
  expect(res).toSatisfy(sameDateArrays(monthWith29Days));
});

test("days in February of leap year", () => {
  const res = getDaysInMonth({ month: 1, year: 2024 });
  expect(res).toSatisfy(sameDateArrays(monthWith29Days));
});

test("days in February of non-leap year", () => {
  const res = getDaysInMonth({ month: 1, year: 2025 });
  expect(res).toSatisfy(sameDateArrays(monthWith28Days));
});

test("31st of April, June, September and November are invalid", () => {
  [3, 5, 8, 10].forEach((m) =>
    expect(isInvalidDate({ day: 31, month: m, year: -1 })).toBe(true)
  );
});

test("30th of February is invalid", () => {
  expect(isInvalidDate({ day: 30, month: 1, year: -1 })).toBe(true);
});

test("29th of February is invalid on non-leap year", () => {
  expect(isInvalidDate({ day: 29, month: 1, year: 2025 })).toBe(true);
});

test("29th of February is valid on leap year", () => {
  expect(isInvalidDate({ day: 29, month: 1, year: 2024 })).toBe(false);
});
