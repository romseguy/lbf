import { format } from "date-fns";
import { fr } from "date-fns/locale";

const fullMinDateString = (date: Date) =>
  format(date, "dd MMMM", {
    locale: fr
  });
const fullMaxDateString = (date: Date) =>
  format(date, "dd MMMM", {
    locale: fr
  });

export const toDateRange = (minDate: Date, maxDate: Date) => {
  return `
      du <b>${format(minDate, "eeee", { locale: fr })}</b>${" "}
      ${fullMinDateString(minDate)} à${" "}
      <b>${format(minDate, "H'h'mm", { locale: fr })}</b>
      <br />
      jusqu'au <b>${format(maxDate, "eeee", { locale: fr })}</b>${" "}
      ${fullMaxDateString(maxDate)} à${" "}
      <b>${format(maxDate, "H'h'mm", { locale: fr })}</b>
      `;
};

export const DateRange = ({
  minDate,
  maxDate
}: {
  minDate: Date;
  maxDate: Date;
}) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: toDateRange(minDate, maxDate)
      }}
    />
  );
};