import { InfoIcon, UpDownIcon, WarningIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Icon,
  Td,
  Text,
  Tooltip,
  VStack
} from "@chakra-ui/react";
import { format, formatISO, getMinutes, getDay } from "date-fns";
import { fr } from "date-fns/locale";
import React, { useState } from "react";
import { Link, GridItem, EntityButton } from "features/common";
// import { NotifModalState } from "features/modals/EntityNotifModal";
import { getCategories, IEvent } from "models/Event";
import { IOrg, IOrgEventCategory } from "models/Org";
import { hasItems } from "utils/array";
import { Session } from "utils/auth";
//import { EventsListItemVisibility } from "./EventsListItemVisibility";

export const EventsListItem = ({
  deleteEvent,
  editEvent,
  editOrg,
  event,
  index,
  isCreator,
  isDark,
  org,
  orgFollowersCount,
  length,
  session,
  eventToForward,
  setEventToForward,
  eventToShow,
  setEventToShow,
  eventToShowOnMap,
  setEventToShowOnMap,
  isLoading,
  setIsLoading,
  // notifyModalState,
  // setNotifyModalState,
  selectedCategories,
  setSelectedCategories,
  city,
  toast,
  ...props
}: {
  deleteEvent: any;
  editEvent: any;
  editOrg: any;
  event: IEvent<Date>;
  index: number;
  isCreator?: boolean;
  isDark: boolean;
  length: number;
  org?: IOrg;
  orgFollowersCount?: number;
  eventToForward: IEvent<Date> | null;
  setEventToForward: (event: IEvent<Date> | null) => void;
  eventToShow: IEvent | null;
  setEventToShow: (event: IEvent | null) => void;
  eventToShowOnMap: IEvent<string | Date> | null;
  setEventToShowOnMap: (event: IEvent<string | Date> | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  // notifyModalState: NotifModalState<IEvent<string | Date>>;
  // setNotifyModalState: (
  //   modalState: NotifModalState<IEvent<string | Date>>
  // ) => void;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  session: Session | null;
  city: string | null;
  toast: any;
}) => {
  const [eventNameClassName, setEventNameClassName] = useState("");

  const minDate = event.eventMinDate;
  const maxDate = event.eventMaxDate;
  const showIsApproved = !!(org && isCreator);
  const isCategorySelected =
    typeof event.eventCategory === "string"
      ? selectedCategories.includes(event.eventCategory)
      : false;

  const categories = getCategories(event);
  const eventCategory: IOrgEventCategory | undefined = event.eventCategory
    ? categories.find(({ catId }) => catId === event.eventCategory)
    : undefined;

  return (
    <>
      <Td
        borderBottomLeftRadius={index === length - 1 ? "lg" : undefined}
        borderWidth={0}
        p={2}
        pl={3}
        textAlign="center"
        verticalAlign="middle"
      >
        <Flex flexDirection="column" alignItems="center">
          {/* eventCategory */}
          {eventCategory && (
            <GridItem mb={2}>
              <Tooltip
                label={
                  !isCategorySelected
                    ? `Afficher les événements de la catégorie "${eventCategory.label}"`
                    : ""
                }
              >
                <Button
                  variant={isCategorySelected ? "solid" : "outline"}
                  colorScheme={isCategorySelected ? "teal" : undefined}
                  fontSize="small"
                  fontWeight="normal"
                  height="auto"
                  p={1}
                  onClick={() => {
                    setSelectedCategories(
                      isCategorySelected
                        ? selectedCategories.filter(
                            (selectedCategory) =>
                              selectedCategory !== event.eventCategory!
                          )
                        : [...selectedCategories, event.eventCategory!]
                    );
                  }}
                >
                  {eventCategory.label}
                </Button>
              </Tooltip>
            </GridItem>
          )}

          {/* eventCity */}
          {event.eventCity &&
            Array.isArray(event.eventAddress) &&
            event.eventAddress.length > 0 && (
              <GridItem mb={2}>
                <Tooltip
                  hasArrow
                  label={event.eventAddress[0].address}
                  placement="right"
                >
                  <span>
                    <Link
                      variant="underline"
                      fontWeight="bold"
                      onClick={() => setEventToShowOnMap(event)}
                    >
                      {event.eventCity}
                    </Link>
                  </span>
                </Tooltip>
              </GridItem>
            )}

          {/* eventDistance */}
          {event.eventDistance && (
            <GridItem mb={2}>
              <Tooltip
                hasArrow
                label={`Événement à ${event.eventDistance} de ${city}`}
                placement="right"
              >
                <Button
                  colorScheme="purple"
                  color="white"
                  fontWeight="normal"
                  fontSize="small"
                  height="auto"
                  p={1}
                  size="sm"
                >
                  {event.eventDistance}
                </Button>
              </Tooltip>
            </GridItem>
          )}

          {/* eventMinDate */}
          <Text fontWeight="bold">
            {format(minDate, `H'h'${getMinutes(minDate) !== 0 ? "mm" : ""}`, {
              locale: fr
            })}
          </Text>

          {maxDate && (
            <>
              <Icon as={UpDownIcon} />

              {/* eventMaxDate */}
              <Text fontWeight="bold" mt={1}>
                {getDay(minDate) !== getDay(maxDate) &&
                  format(maxDate, `EEEE`, { locale: fr })}{" "}
                {format(
                  maxDate,
                  `H'h'${getMinutes(maxDate) !== 0 ? "mm" : ""}`,
                  {
                    locale: fr
                  }
                )}
              </Text>
            </>
          )}
        </Flex>
      </Td>

      <Td
        borderBottomRightRadius={index === length - 1 ? "lg" : undefined}
        borderWidth={0}
        //p={0}
        //verticalAlign="middle"
        width="100%"
      >
        <VStack>
          <EntityButton event={event} />

          {
            event.eventDescription && event.eventDescription.length > 0 ? (
              <Button
                colorScheme="teal"
                leftIcon={<InfoIcon />}
                fontSize="small"
                fontWeight="normal"
                height="auto"
                m={0}
                mt={1}
                p={2}
                whiteSpace="normal"
                onClick={() =>
                  setEventToShow({
                    ...event,
                    eventMinDate: formatISO(minDate),
                    eventMaxDate: maxDate ? formatISO(maxDate) : undefined
                  })
                }
              >
                Voir la description de l'événement
              </Button>
            ) : null

            //<Text fontSize="smaller">Aucune description disponible.</Text>
          }
        </VStack>
      </Td>
    </>
  );
};
