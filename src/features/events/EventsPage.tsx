import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Tag,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Button, IconFooter, Link } from "features/common";
import { EventModal } from "features/modals/EventModal";
import { MapModal } from "features/modals/MapModal";
import { useSession } from "hooks/useAuth";
import { Category, Visibility } from "models/Event";
import { useGetEventsQuery } from "./eventsApi";
import { EventsList } from "./EventsList";

export const EventsPage = ({
  isLogin,
  setIsLogin
}: {
  isLogin: number;
  setIsLogin: (isLogin: number) => void;
}) => {
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const eventsQuery = useGetEventsQuery("eventOrgs");
  useEffect(() => {
    console.log("refetching events");
    eventsQuery.refetch();
  }, [router.asPath]);

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const events = eventsQuery.data?.filter((event) => {
    if (
      event.eventCategory &&
      selectedCategories.length > 0 &&
      !selectedCategories.includes(event.eventCategory)
    )
      return false;
    if (!event.eventCategory && selectedCategories.length > 0) return false;
    if (event.forwardedFrom && event.forwardedFrom.eventId) return false;
    if (event.eventVisibility !== Visibility.PUBLIC) return false;
    // today must be before eventMinDate
    // if (
    //   event.repeat !== 99 &&
    //   compareDesc(new Date(), parseISO(event.eventMinDate)) === -1
    // )
    //   return false;

    return event.isApproved;
  });

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const {
    isOpen: isMapModalOpen,
    onOpen: openMapModal,
    onClose: closeMapModal
  } = useDisclosure({ defaultIsOpen: false });

  const addEvent = () => {
    if (!isSessionLoading) {
      if (session) {
        setIsEventModalOpen(true);
      } else {
        setIsLogin(isLogin + 1);
      }
    }
  };

  return (
    <>
      <>
        <Flex justifyContent="space-between">
          <Button
            colorScheme="teal"
            leftIcon={<AddIcon />}
            mb={5}
            onClick={addEvent}
            data-cy="addEvent"
          >
            Ajouter un événement
          </Button>

          <Tooltip label="Carte des événements">
            <IconButton
              aria-label="Carte des événements"
              colorScheme="teal"
              isLoading={eventsQuery.isLoading}
              isDisabled={!events || !events.length}
              icon={<FaMapMarkerAlt />}
              onClick={openMapModal}
            />
          </Tooltip>
        </Flex>

        {isEventModalOpen && session && (
          <EventModal
            session={session}
            onCancel={() => setIsEventModalOpen(false)}
            onSubmit={async (eventUrl) => {
              await router.push(`/${eventUrl}`, `/${eventUrl}`, {
                shallow: true
              });
            }}
            onClose={() => setIsEventModalOpen(false)}
          />
        )}

        {isMapModalOpen && (
          <MapModal
            isOpen={isMapModalOpen}
            items={
              events?.filter((event) => {
                return (
                  typeof event.eventLat === "number" &&
                  typeof event.eventLng === "number" &&
                  event.eventVisibility === Visibility.PUBLIC
                );
              }) || []
            }
            onClose={closeMapModal}
          />
        )}
      </>

      <Box mb={3}>
        {Object.keys(Category).map((key) => {
          const k = parseInt(key);
          if (k === 0) return null;
          const bgColor = Category[k].bgColor;
          const isSelected = selectedCategories.includes(k);

          return (
            <Link
              key={"cat" + key}
              variant="no-underline"
              onClick={() => {
                setSelectedCategories(
                  selectedCategories.includes(k)
                    ? selectedCategories.filter((sC) => sC !== k)
                    : selectedCategories.concat([k])
                );
              }}
            >
              <Tag
                variant={isSelected ? "solid" : "outline"}
                color={isDark ? "white" : isSelected ? "white" : "black"}
                bgColor={
                  isSelected
                    ? bgColor === "transparent"
                      ? isDark
                        ? "whiteAlpha.300"
                        : "blackAlpha.600"
                      : bgColor
                    : undefined
                }
                mr={1}
                mb={1}
              >
                {Category[k].label}
              </Tag>
            </Link>
          );
        })}
      </Box>

      {eventsQuery.isLoading ? (
        <Text>Chargement des événements publics...</Text>
      ) : Array.isArray(events) && events.length > 0 ? (
        <div>
          <EventsList
            events={events}
            eventsQuery={eventsQuery}
            selectedCategories={selectedCategories}
          />
          <IconFooter />
        </div>
      ) : (
        <>
          {selectedCategories.length === 1 ? (
            <>
              Aucun événement public dans la catégorie{" "}
              <Tag
                color="white"
                bgColor={
                  Category[selectedCategories[0]].bgColor === "transparent"
                    ? isDark
                      ? "whiteAlpha.300"
                      : "blackAlpha.600"
                    : Category[selectedCategories[0]].bgColor
                }
              >
                {Category[selectedCategories[0]].label}
              </Tag>
            </>
          ) : selectedCategories.length > 1 ? (
            <>
              Aucun événement public dans les catégories{" "}
              {selectedCategories.map((sC) => {
                return (
                  <Tag
                    color="white"
                    bgColor={
                      Category[sC].bgColor === "transparent"
                        ? isDark
                          ? "whiteAlpha.300"
                          : "blackAlpha.600"
                        : Category[sC].bgColor
                    }
                    mr={1}
                  >
                    {Category[sC].label}
                  </Tag>
                );
              })}
            </>
          ) : (
            <>
              Aucun événement public{" "}
              <Link variant="underline" onClick={addEvent}>
                cliquez ici
              </Link>{" "}
              pour en ajouter un.
            </>
          )}
        </>
      )}
    </>
  );
};
