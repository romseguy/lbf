import {
  Avatar,
  Box,
  BoxProps,
  Flex,
  Icon,
  Menu,
  MenuButton,
  Spinner,
  Table,
  Tbody,
  Tr,
  Td,
  Tooltip,
  IconButton,
  useColorMode,
  Text,
  HStack
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import { useSelector } from "react-redux";
import { AppHeading, DarkModeSwitch, Link, LinkShare } from "features/common";
import { NotificationPopover } from "features/layout";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { IEntity, isEvent, isOrg } from "models/Entity";
import { orgTypeFull, OrgTypes } from "models/Org";
import { IUser } from "models/User";
import { selectUserEmail } from "store/userSlice";
import { NavButtonsList } from "./NavButtonsList";
import { NavMenuList } from "./NavMenuList";

export const Nav = ({
  isMobile,
  pageTitle,
  entity,
  ...props
}: BoxProps &
  PageProps & {
    entity?: IEntity | IUser;
    pageTitle?: string;
  }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();
  const userEmail = useSelector(selectUserEmail);
  const userName = session?.user.userName || "";
  const [isNetworksModalOpen, setIsNetworksModalOpen] = useState(false);
  const isE = isEvent(entity);
  const isO = isOrg(entity);
  const entityUrl = isO ? entity.orgUrl : isE ? entity.eventUrl : "";

  const iconProps = {
    bg: isDark ? "teal.300" : "teal.500",
    borderColor: isDark ? "gray.600" : "gray.200",
    borderRadius: 9999,
    borderStyle: "solid",
    borderWidth: 1,
    color: isDark ? "black" : "white",
    mr: 3,
    px: 5,
    py: 6,
    _hover: { bg: "blue.400", color: "white" }
  };

  return (
    <Box as="nav" {...props}>
      {!isMobile && (
        <Table role="navigation">
          <Tbody role="rowgroup">
            <Tr role="rowheader">
              <Td border={0} p={0}>
                <HStack spacing={3}>
                  {router.pathname !== "/" && router.asPath !== "/photo" && (
                    <>
                      <Tooltip label="Retour" placement="right">
                        <IconButton
                          aria-label="Retour"
                          colorScheme="purple"
                          icon={<Icon as={FaArrowLeft} />}
                          onClick={() => {
                            if (
                              window.history?.length &&
                              window.history.length > 1
                            ) {
                              router.back();
                            } else {
                              router.replace("/");
                            }
                          }}
                        />
                      </Tooltip>

                      {isE && (
                        <Tooltip label="Revenir à l'atelier" placement="right">
                          <IconButton
                            aria-label="Revenir à l'atelier"
                            colorScheme="purple"
                            icon={<Icon as={FaHome} boxSize={8} />}
                            onClick={() =>
                              router.push(
                                `/${entity.eventOrgs[0].orgUrl}`,
                                `/${entity.eventOrgs[0].orgUrl}`,
                                { shallow: true }
                              )
                            }
                          />
                        </Tooltip>
                      )}
                    </>
                  )}

                  {isO && (
                    <Text fontSize="4xl">{OrgTypes[entity.orgType]} :</Text>
                  )}

                  <AppHeading noContainer>
                    <Link href="/photo" shallow>
                      {pageTitle
                        ? pageTitle
                        : entity
                        ? isO
                          ? `${entity.orgName}`
                          : isE
                          ? entity.eventName
                          : process.env.NEXT_PUBLIC_SHORT_URL + router.asPath
                        : process.env.NEXT_PUBLIC_SHORT_URL}
                    </Link>
                  </AppHeading>

                  {entityUrl && (
                    <LinkShare
                      url={`${process.env.NEXT_PUBLIC_URL}/${entityUrl}`}
                      colorScheme="blue"
                      label={`Copier le lien ${
                        isE
                          ? "de l'événement"
                          : isO
                          ? orgTypeFull(entity.orgType)
                          : "de l'utilisateur"
                      }`}
                      tooltipProps={{ placement: "right" }}
                      variant="outline"
                    />
                  )}
                </HStack>
              </Td>
              <Td border={0} display="flex" justifyContent="flex-end" gap={3}>
                {/* <Tooltip label={`Rechercher`} hasArrow>
                  <IconButton
                    aria-label="Rechercher"
                    icon={<SearchIcon />}
                    colorScheme={"red"}
                    borderRadius={"9999px"}
                    onClick={() => {
                      setIsNetworksModalOpen(true);
                    }}
                  />
                </Tooltip> */}

                <Tooltip
                  label={`Basculer vers le thème ${
                    isDark ? "clair" : "sombre"
                  }`}
                  hasArrow
                >
                  <Box>
                    <DarkModeSwitch />
                  </Box>
                </Tooltip>
              </Td>
            </Tr>

            <Tr role="row">
              {/* Parcourir | Événements */}
              <Td border={0} p={isMobile ? 0 : "0px 0 0 0"}>
                {session ? (
                  <NavButtonsList
                    isNetworksModalOpen={isNetworksModalOpen}
                    onClose={() => {
                      setIsNetworksModalOpen(false);
                    }}
                  />
                ) : (
                  <>
                    {/*<LoginButton colorScheme="purple">Se connecter</LoginButton>*/}
                  </>
                )}
              </Td>
              <Td border={0} p={0} textAlign="right">
                {/* NYI */}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      )}

      {/* {isMobile && !session && (
        <LoginButton colorScheme="cyan" bg="lightcyan" mb={1}>
          Se connecter
        </LoginButton>
      )} */}

      {session && userEmail ? (
        <Table
          role="navigation"
          bg={isDark ? "gray.700" : "blackAlpha.50"}
          borderRadius="lg"
          width={isMobile ? undefined : "auto"}
          mb={isMobile ? 1 : 0}
          mt={isMobile ? undefined : 0}
        >
          <Tbody role="rowgroup">
            {/* <Tr role="rowheader">
              <Td border={0} lineHeight="auto" p={0} pl={2}>
                <Flex alignItems="center">
                  <Icon as={FaUser} boxSize={7} mr={2} />
                  <Heading>{session.user.userName}</Heading>
                </Flex>
              </Td>
            </Tr> */}
            <Tr role="row">
              <Td border={0} p={0}>
                <Flex m={2}>
                  <Menu>
                    {/* <Tooltip
                        label={`Connecté en tant que ${userEmail}`}
                        placement="left"
                      >
                      </Tooltip> */}
                    <MenuButton aria-label="Menu" mr={2}>
                      <Avatar
                        boxSize={12}
                        bgColor={isDark ? undefined : "#2B6CB0"}
                        color={isDark ? undefined : "white"}
                        name={userName}
                        src={
                          session.user.userImage
                            ? session.user.userImage.base64
                            : undefined
                        }
                      />
                    </MenuButton>

                    <NavMenuList
                      entity={entity}
                      email={userEmail}
                      //session={session}
                      userName={userName}
                      zIndex={9999}
                    />
                  </Menu>

                  <NotificationPopover
                    isMobile={isMobile}
                    session={session}
                    offset={[isMobile ? -141 : 140, 15]}
                    iconProps={{ ...iconProps, ...{ mr: 0 } }}
                  />

                  {/* {session.user.isAdmin && (
                    <>
                      <OrgPopover
                        label="Mes ateliers"
                        isMobile={isMobile}
                        orgType={EOrgType.NETWORK}
                        session={session}
                        offset={[isMobile ? 95 : 140, 15]}
                        iconProps={{ ...iconProps, ...{} }}
                      />
                      <OrgPopover
                        isMobile={isMobile}
                        session={session}
                        offset={[isMobile ? 20 : 140, 15]}
                        iconProps={iconProps}
                      />
                      <EventPopover
                        isMobile={isMobile}
                        session={session}
                        offset={[isMobile ? 35 : 140, 15]}
                        iconProps={iconProps}
                      />
                      <TopicPopover
                        isMobile={isMobile}
                        session={session}
                        offset={[isMobile ? -30 : 140, 15]}
                        iconProps={iconProps}
                      />
                    </>
                  )} */}

                  {/* {!isMobile && (
                    <NotificationPopover
                      isMobile={isMobile}
                      session={session}
                      offset={[isMobile ? -141 : 140, 15]}
                      iconProps={{ ...iconProps, ...{ mr: 0 } }}
                    />
                  )} */}
                </Flex>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      ) : isSessionLoading ? (
        <Spinner />
      ) : null}
    </Box>
  );
};
