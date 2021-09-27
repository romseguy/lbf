import {
  format,
  formatDuration as oFormatDuration,
  intervalToDuration,
  parseISO
} from "date-fns";
import { fr } from "date-fns/locale";

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
