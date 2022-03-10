import { Heading, TableCellProps, Tr, Td } from "@chakra-ui/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import React from "react";

export const EventsListHeader = ({
  minDate,
  ...props
}: TableCellProps & {
  minDate: Date;
}) => {
  return (
    <Tr>
      <Td colSpan={3} p={0} pl={3} border={0} {...props}>
        <Heading size="sm" py={3}>
          {format(minDate, "cccc d MMMM", {
            locale: fr
          })}
        </Heading>
      </Td>
    </Tr>
  );
};
