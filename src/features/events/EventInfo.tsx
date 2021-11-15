import {
  AtSignIcon,
  PhoneIcon,
  SmallAddIcon,
  ViewIcon,
  ViewOffIcon
} from "@chakra-ui/icons";
import { Flex, FlexProps, Icon, Tooltip } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaMapMarkedAlt, FaGlobeEurope } from "react-icons/fa";
import { Link } from "features/common";
import { IEvent } from "models/Event";

export const EventInfo = ({
  event,
  ...props
}: FlexProps & { event: Partial<IEvent> }) => {
  const [emailCollapsed, setEmailCollapsed] = useState(true);
  const [webCollapsed, setWebCollapsed] = useState(true);

  return (
    <Flex flexDirection="column" {...props}>
      {event.eventAddress && (
        <Flex flexDirection="column">
          {event.eventAddress.map(({ address }, index) => (
            <Flex key={`address-${index}`} alignItems="center">
              <Icon as={FaMapMarkedAlt} mr={3} />
              {address}
            </Flex>
          ))}
        </Flex>
      )}

      {event.eventEmail && (
        <Flex flexDirection="column">
          {event.eventEmail?.map(({ email }, index) => (
            <Flex key={`email-${index}`} alignItems="center">
              <AtSignIcon mr={3} />

              <Link variant="underline" href={`mailto:${email}`}>
                {emailCollapsed ? email.substr(0, 9) + "..." : email}
              </Link>

              {emailCollapsed ? (
                <Tooltip
                  label="Voir en entier l'adresse e-mail"
                  placement="top"
                >
                  <ViewIcon
                    cursor="pointer"
                    ml={2}
                    onClick={() => setEmailCollapsed(false)}
                  />
                </Tooltip>
              ) : (
                <ViewOffIcon
                  cursor="pointer"
                  ml={2}
                  onClick={() => setEmailCollapsed(true)}
                />
              )}
            </Flex>
          ))}
        </Flex>
      )}

      {event.eventPhone && (
        <Flex flexDirection="column">
          {event.eventPhone?.map(({ phone }, index) => (
            <Flex key={`phone-${index}`} alignItems="center">
              <PhoneIcon mr={3} />
              <Link
                variant="underline"
                href={`tel:+33${phone.substr(1, phone.length)}`}
              >
                {phone}
              </Link>
            </Flex>
          ))}
        </Flex>
      )}

      {event.eventWeb && (
        <Flex flexDirection="column">
          {event.eventWeb?.map((eventWeb, index) => {
            const { prefix } = eventWeb;
            const url = eventWeb.url.includes("http")
              ? eventWeb.url
                  .replace("https://", "")
                  .replace("http://", "")
                  .replace("www.", "")
              : prefix + eventWeb.url;
            return (
              <Flex key={`web-${index}`} alignItems="center">
                <Icon as={FaGlobeEurope} mr={3} />
                <Link variant="underline" href={eventWeb.url}>
                  {webCollapsed ? url.substr(0, 9) + "..." : url}
                </Link>

                {webCollapsed ? (
                  <Tooltip
                    label="Voir en entier l'adresse du site internet"
                    placement="top"
                  >
                    <ViewIcon
                      cursor="pointer"
                      ml={2}
                      onClick={() => setWebCollapsed(false)}
                    />
                  </Tooltip>
                ) : (
                  <ViewOffIcon
                    cursor="pointer"
                    ml={2}
                    onClick={() => setWebCollapsed(true)}
                  />
                )}
              </Flex>
            );
          })}
        </Flex>
      )}
    </Flex>
  );
};
