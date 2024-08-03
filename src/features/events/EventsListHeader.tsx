import { Heading, TableCellProps, Tr, Td } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import { format, getYear } from "date-fns";
import { fr } from "date-fns/locale";
import React from "react";

export const EventsListHeader = ({
  minDate,
  ...props
}: TableCellProps & {
  minDate: Date;
}) => {
  const dateFormat =
    getYear(minDate) !== getYear(Date.now())
      ? "cccc d MMMM yyyy"
      : "cccc d MMMM";

  return (
    <Tr>
      <Td colSpan={3} p={0} pl={3} border={0} {...props}>
        <Heading size="sm" py={3}>
          {format(minDate, dateFormat, {
            locale: fr
          })}
        </Heading>
      </Td>
    </Tr>
  );
};
