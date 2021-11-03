import {
  compareDesc,
  format,
  formatDuration as oFormatDuration,
  getDay,
  getHours,
  getMinutes,
  getSeconds,
  intervalToDuration,
  parseISO,
  setDay,
  setHours,
  setMinutes,
  setSeconds
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

export const timeAgo = (date?: string | Date, isShort?: boolean) => {
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

  let format = formatArray;

  if (isShort) {
    if (duration.days === 0 && duration.hours && duration.hours > 0) {
      format = formatArray.filter((f) => f === "hours");
    }
  }

  const formatted = formatDuration(duration, {
    format
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
