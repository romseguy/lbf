import { ArrowForwardIcon, CalendarIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  FlexProps,
  List,
  ListItem,
  Text,
  useColorMode
} from "@chakra-ui/react";
import { format, getDay, getHours, parseISO, setDay } from "date-fns";
import { fr } from "date-fns/locale";
import React from "react";
import { css } from "twin.macro";
import { IEvent } from "models/Event";
import * as dateUtils from "utils/date";

export type EventTimelineType = {
  [index: number]: { startDate: Date; endTime: Date };
};

export const EventTimeline = ({
  event,
  ...props
}: FlexProps & { event: IEvent }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const eventMinDate = parseISO(event.eventMinDate);
  const eventMaxDate = parseISO(event.eventMaxDate);
  let startDay: number = getDay(eventMinDate);
  startDay = startDay === 0 ? 6 : startDay - 1;

  const timeline: EventTimelineType = dateUtils.days.reduce(
    (obj, label, index) => {
      if (startDay === index)
        return {
          ...obj,
          [index]: {
            startDate: eventMinDate,
            endTime: eventMaxDate
          }
        };

      if (event.otherDays) {
        for (const { dayNumber, startDate, endTime } of event.otherDays) {
          if (dayNumber === index) {
            return {
              ...obj,
              [index]: {
                startDate: startDate
                  ? parseISO(startDate)
                  : setDay(eventMinDate, dayNumber + 1),
                endTime: endTime
                  ? parseISO(endTime)
                  : setDay(eventMaxDate, dayNumber + 1)
              }
            };
          }
        }
      }

      return obj;
    },
    {}
  );

  const renderTimeline = () =>
    Object.keys(timeline).map((key) => {
      const dayNumber = parseInt(key);
      const day = timeline[dayNumber];

      return (
        <ListItem key={"timeline-item-" + key}>
          <Text fontWeight="bold">
            {event.repeat === 99
              ? format(day.startDate, "cccc", { locale: fr })
              : format(day.startDate, "cccc d MMMM", { locale: fr })}
          </Text>
          <Box display="flex" alignItems="center" ml={3} fontWeight="bold">
            <Text color="green">
              {format(day.startDate, "H:mm", { locale: fr })}
            </Text>
            <ArrowForwardIcon />
            <Text color="red">
              {getDay(day.startDate) !== getDay(day.endTime)
                ? format(day.endTime, "cccc d MMMM", { locale: fr })
                : ""}{" "}
              {format(day.endTime, "H:mm", { locale: fr })}
            </Text>
          </Box>
        </ListItem>
      );
    });

  return (
    <Flex flexDirection="column" {...props}>
      {event.repeat && (
        <Text display="flex" alignItems="center" fontWeight="bold" mb={1}>
          <CalendarIcon mr={1} />
          {event.repeat === 99 ? "Toutes les semaines" : ""}
        </Text>
      )}
      <List
        spacing={3}
        css={css`
          & > li {
            list-style: none;
            margin-left: 12px;
            margin-top: 0 !important;
            border-left: 2px dashed ${isDark ? "white" : "black"};
            padding: 0 0 0 20px;
            position: relative;

            &::before {
              position: absolute;
              left: -14px;
              top: 0;
              content: " ";
              border: 8px solid rgba(255, 255, 255, 0.74);
              border-radius: 500%;
              background: #3f4e58;
              height: 25px;
              width: 25px;
              transition: all 500ms ease-in-out;
            }
          }
        `}
      >
        {renderTimeline()}
      </List>
    </Flex>
  );
};
