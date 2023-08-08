import {
  addDays,
  compareDesc,
  format,
  formatDuration as oFormatDuration,
  getDay,
  getDaysInMonth,
  getHours,
  getMinutes,
  getSeconds,
  intervalToDuration,
  parseISO,
  setDay,
  setHours,
  setMinutes,
  setSeconds,
  startOfMonth
} from "date-fns";
import { fr } from "date-fns/locale";

/*
compareAsc
  Compare the two dates and return
  1 if the first date is after the second
  -1 if the first date is before the second
  0 if dates are equal.

compareDesc
  Compare the two dates and return
  1 if the first date is before the second 
  -1 if the first date is after the second
   0 if dates are equal.
*/

export const days = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche"
];

var DAYS_IN_A_WEEK = 7;

/**
 * @name getNthDayOfMonth
 * @category Month Helpers
 * @summary Get the nth weekday for a date
 *
 * @description
 * Get then nth weekday in a month of the given date, day and week.
 *
 * @param {Date|Number} date - the given date
 * @param {Number} day - the given day to be found in the month
 * @param {Date|Number} week - the given week to be calculated *
 * @returns {Date} the date of nth day of the month
 * @throws {TypeError} 3 argument required
 * @throws {RangeError}  day is between 0 and 6 _and_ is not NaN
 * @throws {RangeError}  the day calulated should not exceed the given month
 *
 *
 *
 * @example
 * // What is the 4th Wednesday of 1st July, 2020?
 * var result = getNthDayOfMonth(new Date(2020, 6, 1), 3, 4)
 * //=> Wed Jul 22 2020 00:00:00 (4th Wednesday of the month)
 */
export function getNthDayOfMonth(date: Date, day: number, week: number) {
  if (!(day >= 0 && day <= 6)) {
    console.error("day must be between 0 and 6 inclusively", day);
    return date;
  }

  const startOfMonthVal = startOfMonth(date);
  const daysToBeAdded =
    (week - 1) * DAYS_IN_A_WEEK +
    ((DAYS_IN_A_WEEK + day - getDay(startOfMonthVal)) % DAYS_IN_A_WEEK);
  const nthDayOfMonth = addDays(startOfMonthVal, daysToBeAdded);

  //Test if the days to be added excees the current month
  if (daysToBeAdded >= getDaysInMonth(date)) {
    console.error("the nth day exceeds the month");
    return date;
  }

  return nthDayOfMonth;
}

export const formatArray = [
  "years",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes"
];

const formatDistanceLocale = {
  xSeconds: "{{count}}s",
  xMinutes: "{{count}}m",
  xHours: "{{count}}h",
  xDays: "{{count}}j",
  xMonths: "{{count}}m",
  xYears: "{{count}}y"
} as { [key: string]: string };

export const formatDuration = (
  duration: Duration,
  { format }: { format: string[] }
) => {
  return oFormatDuration(duration, {
    format,
    locale: {
      formatDistance: (token, count) =>
        formatDistanceLocale[token].replace("{{count}}", count)
    }
  });
};

export const fullDateString = (date: Date) => {
  return format(date, "eeee dd MMMM yyyy à H'h'mm", {
    locale: fr
  });
};

export const timeAgo = (
  date?: string | Date,
  isShort?: boolean,
  format?: string[]
) => {
  const end =
    typeof date === "string"
      ? parseISO(date)
      : date !== undefined
      ? date
      : new Date();
  const fullDate = fullDateString(end);
  const duration = intervalToDuration({
    start: new Date(),
    end
  });

  const formatted = formatDuration(duration, {
    format: isShort
      ? (format || formatArray).filter((f) =>
          duration.days === 0 && duration.hours && duration.hours > 0
            ? f === "hours"
            : typeof duration.days === "number" && duration.days > 0
            ? f === "days"
            : f
        )
      : format || formatArray
  });

  return { timeAgo: formatted === "" ? "1m" : formatted, fullDate };
};

export const moveDateToCurrentWeek = (date: Date) => {
  const today = new Date();
  return setSeconds(
    setMinutes(
      setHours(setDay(today, getDay(date)), getHours(date)),
      getMinutes(date)
    ),
    getSeconds(date)
  );
};
