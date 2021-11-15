import { AtSignIcon, ViewIcon, ViewOffIcon, PhoneIcon } from "@chakra-ui/icons";
import { Flex, FlexProps, Icon, Tooltip } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaMapMarkedAlt, FaGlobeEurope } from "react-icons/fa";
import { IOrg } from "models/Org";
import { Link } from "features/common";

export const OrgInfo = ({
  org,
  ...props
}: FlexProps & { org: Partial<IOrg> }) => {
  const [emailCollapsed, setEmailCollapsed] = useState(true);
  const [webCollapsed, setWebCollapsed] = useState(true);

  return (
    <Flex flexDirection="column" {...props}>
      {org.orgAddress && (
        <Flex flexDirection="column">
          {org.orgAddress.map(({ address }, index) => (
            <Flex key={`address-${index}`} alignItems="center">
              <Icon as={FaMapMarkedAlt} mr={3} />
              {address}
            </Flex>
          ))}
        </Flex>
      )}

      {org.orgEmail && (
        <Flex flexDirection="column">
          {org.orgEmail?.map(({ email }, index) => (
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

      {org.orgPhone && (
        <Flex flexDirection="column">
          {org.orgPhone?.map(({ phone }, index) => (
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

      {org.orgWeb && (
        <Flex flexDirection="column">
          {org.orgWeb?.map((orgWeb, index) => {
            const { prefix } = orgWeb;
            const url = orgWeb.url.includes("http")
              ? orgWeb.url
                  .replace("https://", "")
                  .replace("http://", "")
                  .replace("www.", "")
              : prefix + orgWeb.url;
            return (
              <Flex key={`web-${index}`} alignItems="center">
                <Icon as={FaGlobeEurope} mr={3} />
                <Link variant="underline" href={orgWeb.url}>
                  {/* {webCollapsed ? url.substr(0, 9) + "..." : url} */}
                  {url}
                </Link>

                {/* {webCollapsed ? (
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
                )} */}
              </Flex>
            );
          })}
        </Flex>
      )}
    </Flex>
  );
};
