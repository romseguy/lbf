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
import { format, getDay, parseISO, setDay } from "date-fns";
import { fr } from "date-fns/locale";
import React from "react";
import { css } from "twin.macro";
import { IEvent, monthRepeatOptions } from "models/Event";
import { hasItems } from "utils/array";
import * as dateUtils from "utils/date";

export type EventTimelineType = {
  [index: number]: { startDate: Date; endTime: Date; monthRepeat?: number[] };
};

export const EventTimeline = ({
  event,
  ...props
}: FlexProps & { event: IEvent<string | Date> }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const eventMinDate =
    typeof event.eventMinDate === "string"
      ? parseISO(event.eventMinDate)
      : event.eventMinDate;
  const eventMaxDate =
    typeof event.eventMaxDate === "string"
      ? parseISO(event.eventMaxDate)
      : event.eventMaxDate;
  let startDay: number = getDay(eventMinDate);
  startDay = startDay === 0 ? 6 : startDay - 1;

  const timeline: EventTimelineType = dateUtils.days.reduce(
    (obj, label, index) => {
      let ret = { ...obj };

      if (startDay === index)
        ret = {
          ...ret,
          [index]: {
            startDate: eventMinDate,
            endTime: eventMaxDate
          }
        };

      if (Array.isArray(event.otherDays) && event.otherDays.length > 0) {
        for (const day of event.otherDays) {
          const { dayNumber, startDate, endTime } = day;
          if (dayNumber === index) {
            ret = {
              ...ret,
              [index]: {
                ...day,
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

      return ret;
    },
    {}
  );

  const renderTimeline = () =>
    Object.keys(timeline).map((key) => {
      const dayNumber = parseInt(key);
      const day = timeline[dayNumber];
      //console.log(day, dayNumber);

      return (
        <ListItem key={"timeline-item-" + key}>
          <Box fontWeight="bold">
            {event.repeat === 99
              ? format(day.startDate, "cccc", { locale: fr })
              : Array.isArray(day.monthRepeat) && day.monthRepeat.length > 0
              ? day.monthRepeat.map((monthRepeatOption) => (
                  <div key={`monthRepeat-${monthRepeatOption}`}>
                    Le {monthRepeatOptions[monthRepeatOption]}{" "}
                    {format(day.startDate, "cccc", { locale: fr })} de chaque
                    mois
                  </div>
                ))
              : format(day.startDate, "cccc d MMMM", { locale: fr })}
          </Box>

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
