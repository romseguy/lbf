import {
  format,
  formatDuration as oFormatDuration,
  intervalToDuration,
  parseISO
} from "date-fns";
import { fr } from "date-fns/locale";

export const days = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche"
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

  let formatArray = ["years", "months", "weeks", "days", "hours", "minutes"];

  if (isShort) {
    if (duration.days === 0 && duration.hours && duration.hours > 0) {
      formatArray = ["hours"];
    }
  }

  const formatted = formatDuration(duration, {
    format: formatArray
  });

  return { timeAgo: formatted === "" ? "1m" : formatted, fullDate };
};
