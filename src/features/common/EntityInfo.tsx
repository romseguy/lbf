import { AtSignIcon, ViewIcon, ViewOffIcon, PhoneIcon } from "@chakra-ui/icons";
import { Flex, FlexProps, Icon, Link, Tooltip } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaMapMarkedAlt, FaGlobeEurope } from "react-icons/fa";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { isEvent } from "utils/models";

export const EntityInfo = ({
  entity,
  ...props
}: FlexProps & { entity: IOrg | IEvent<string | Date> }) => {
  const [emailCollapsed, setEmailCollapsed] = useState<{
    [key: number]: boolean;
  }>({});
  const [webCollapsed, setWebCollapsed] = useState<{ [key: number]: boolean }>(
    {}
  );
  const isE = isEvent(entity);
  const entityAddress = isE ? entity.eventAddress : entity.orgAddress;
  const entityEmail = isE ? entity.eventEmail : entity.orgEmail;
  const entityPhone = isE ? entity.eventPhone : entity.orgPhone;
  const entityWeb = isE ? entity.eventWeb : entity.orgWeb;

  return (
    <Flex flexDirection="column" {...props}>
      {entityAddress && (
        <Flex flexDirection="column">
          {entityAddress.map(({ address }, index) => (
            <Flex key={`address-${index}`} alignItems="center">
              <Icon as={FaMapMarkedAlt} mr={3} />
              {address}
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
            return (
              <Flex key={`email-${index}`} alignItems="center">
                <AtSignIcon mr={3} />

                <Link variant="underline" href={`mailto:${email}`}>
                  {isCollapsed ? email.substr(0, 9) + "..." : email}
                </Link>

                {isCollapsed ? (
                  <Tooltip
                    label="Voir en entier l'adresse e-mail"
                    placement="top"
                  >
                    <ViewIcon
                      cursor="pointer"
                      ml={2}
                      onClick={() =>
                        setEmailCollapsed({ ...emailCollapsed, [index]: false })
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
                )}
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
            const uri = url.includes("http")
              ? url
                  .replace("https://", "")
                  .replace("http://", "")
                  .replace("www.", "")
              : url;
            let shortUrl = uri;
            if (uri.length > 9 && isCollapsed)
              shortUrl = uri.substr(0, 9) + "...";

            return (
              <Flex key={`web-${index}`} alignItems="center">
                <Icon as={FaGlobeEurope} mr={3} />
                <Link
                  variant="underline"
                  href={url.includes("http") ? url : `${prefix}${url}`}
                >
                  {shortUrl}
                </Link>

                {uri.length > 9 ? (
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
    </Flex>
  );
};
