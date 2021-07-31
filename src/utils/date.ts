import { formatDuration as oFormatDuration } from "date-fns";

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
