import { AtSignIcon, ViewIcon, ViewOffIcon, PhoneIcon } from "@chakra-ui/icons";
import {
  Flex,
  FlexProps,
  Icon,
  Tooltip,
  useDisclosure
} from "@chakra-ui/react";
import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import {
  FaMapMarkedAlt,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLink
} from "react-icons/fa";
import { Link } from "features/common";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { MapModal } from "features/modals/MapModal";

export const EntityInfo = ({
  event,
  org,
  ...props
}: FlexProps & { org?: IOrg; event?: IEvent<string | Date> }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [emailCollapsed, setEmailCollapsed] = useState<{
    [key: number]: boolean;
  }>({});
  const [webCollapsed, setWebCollapsed] = useState<{ [key: number]: boolean }>(
    {}
  );
  const entityAddress = event ? event.eventAddress : org?.orgAddress;
  const entityEmail = event ? event.eventEmail : org?.orgEmail;
  const entityPhone = event ? event.eventPhone : org?.orgPhone;
  const entityWeb = event ? event.eventWeb : org?.orgWeb;

  if (!event && !org) return null;

  return (
    <Flex flexDirection="column" {...props}>
      {entityAddress && (
        <Flex flexDirection="column">
          {entityAddress.map(({ address }, index) => (
            <Flex
              key={`address-${index}`}
              alignSelf="flex-start"
              alignItems="center"
            >
              <Icon as={FaMapMarkedAlt} mr={3} />
              <Tooltip hasArrow label="Voir sur la carte" placement="top">
                <span>
                  <Link variant="underline" onClick={onOpen}>
                    {address}
                  </Link>
                </span>
              </Tooltip>
            </Flex>
          ))}
        </Flex>
      )}

      {entityEmail && (
        <Flex flexDirection="column">
          {entityEmail?.map(({ email }, index) => {
            const isCollapsed =
              emailCollapsed[index] === undefined
                ? true
                : !!emailCollapsed[index];
            let shortEmail = email;
            let canCollapse = email.length > 9 && isMobile;
            if (canCollapse && isCollapsed)
              shortEmail = email.substr(0, 9) + "...";

            return (
              <Flex key={`email-${index}`} alignItems="center">
                <AtSignIcon mr={3} />

                <Link variant="underline" href={`mailto:${email}`}>
                  {shortEmail}
                </Link>

                {canCollapse ? (
                  isCollapsed ? (
                    <Tooltip
                      label="Voir en entier l'adresse e-mail"
                      placement="top"
                    >
                      <ViewIcon
                        cursor="pointer"
                        ml={2}
                        onClick={() =>
                          setEmailCollapsed({
                            ...emailCollapsed,
                            [index]: false
                          })
                        }
                      />
                    </Tooltip>
                  ) : (
                    <ViewOffIcon
                      cursor="pointer"
                      ml={2}
                      onClick={() =>
                        setEmailCollapsed({ ...emailCollapsed, [index]: true })
                      }
                    />
                  )
                ) : null}
              </Flex>
            );
          })}
        </Flex>
      )}

      {entityPhone && (
        <Flex flexDirection="column">
          {entityPhone?.map(({ phone }, index) => (
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

      {entityWeb && (
        <Flex flexDirection="column">
          {entityWeb?.map(({ prefix, url }, index) => {
            const isCollapsed =
              webCollapsed[index] === undefined ? true : !!webCollapsed[index];

            const icon = url.includes("facebook")
              ? FaFacebook
              : url.includes("instagram")
              ? FaInstagram
              : url.includes("twitter")
              ? FaTwitter
              : url.includes("youtube")
              ? FaYoutube
              : FaLink;

            let uri = url.includes("http")
              ? url
                  .replace("https://", "")
                  .replace("http://", "")
                  .replace("www.", "")
              : url;
            uri = uri.replace(/\/$/, "");
            let shortUrl = uri;
            let canCollapse = uri.length > 9 && isMobile;
            if (canCollapse && isCollapsed) shortUrl = uri.substr(0, 9) + "...";

            return (
              <Flex key={`web-${index}`} alignItems="center">
                <Icon as={icon} mr={3} />
                <Link
                  target="_blank"
                  variant="underline"
                  href={url.includes("http") ? url : `${prefix}${url}`}
                >
                  {shortUrl}
                </Link>

                {canCollapse ? (
                  isCollapsed ? (
                    <Tooltip
                      label="Voir en entier l'adresse du site internet"
                      placement="top"
                    >
                      <ViewIcon
                        cursor="pointer"
                        ml={2}
                        onClick={() =>
                          setWebCollapsed({ ...webCollapsed, [index]: false })
                        }
                      />
                    </Tooltip>
                  ) : (
                    <ViewOffIcon
                      cursor="pointer"
                      ml={2}
                      onClick={() =>
                        setWebCollapsed({ ...webCollapsed, [index]: true })
                      }
                    />
                  )
                ) : null}
              </Flex>
            );
          })}
        </Flex>
      )}

      <MapModal
        isOpen={isOpen}
        isSearch={false}
        events={event ? [event] : undefined}
        orgs={org ? [org] : undefined}
        center={{
          lat: event ? event.eventLat : org?.orgLat,
          lng: event ? event.eventLng : org?.orgLng
        }}
        zoomLevel={16}
        onClose={onClose}
      />
    </Flex>
  );
};
