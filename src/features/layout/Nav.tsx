import {
  Avatar,
  Box,
  BoxProps,
  Flex,
  Menu,
  MenuButton,
  useColorMode,
  Table,
  Tbody,
  Tr,
  Td
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";
import { Heading, Link, LoginButton } from "features/common";
import {
  EventPopover,
  OrgPopover,
  NotificationPopover,
  TopicPopover
} from "features/layout";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { EOrgType } from "models/Org";
import { selectUserEmail } from "store/userSlice";
import { NavButtonsList } from "./NavButtonsList";
import { NavMenuList } from "./NavMenuList";

export const Nav = ({
  isMobile,
  title,
  ...props
}: BoxProps & PageProps & { title?: string }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = useSelector(selectUserEmail);
  const userName = session?.user.userName || "";

  const popoverProps = {
    bg: isDark ? "gray.800" : "lightcyan",
    borderColor: isDark ? "gray.600" : "gray.200",
    borderRadius: 9999,
    borderStyle: "solid",
    borderWidth: 1,
    mr: 3,
    pt: 0.5
  };

  return (
    <Box as="nav" {...props}>
      {!isMobile && (
        <Table role="navigation">
          <Tbody role="rowgroup">
            <Tr role="rowheader">
              <Td border={0} p={0}>
                <Heading mb={2}>
                  <Link href="/" shallow>
                    {process.env.NEXT_PUBLIC_SHORT_URL}
                  </Link>
                </Heading>
              </Td>
            </Tr>

            <Tr role="row">
              <Td border={0} p={isMobile ? 0 : "16px 0 0 0"}>
                <NavButtonsList title={title} />
              </Td>
              {!session && (
                <Td border={0} p={0} textAlign="right">
                  <LoginButton colorScheme="cyan" bg="lightcyan">
                    Se connecter
                  </LoginButton>
                </Td>
              )}
            </Tr>
          </Tbody>
        </Table>
      )}

      {isMobile && !session && (
        <LoginButton colorScheme="cyan" bg="lightcyan" mb={1}>
          Se connecter
        </LoginButton>
      )}

      {session && userEmail && (
        <Table
          role="navigation"
          bg={isDark ? "gray.700" : "gray.200"}
          borderRadius="lg"
          width={isMobile ? undefined : "auto"}
          mb={isMobile ? 1 : 0}
          mt={isMobile ? undefined : 3}
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
                  <>
                    <Menu>
                      {/* <Tooltip
                        label={`Connecté en tant que ${userEmail}`}
                        placement="left"
                      >
                      </Tooltip> */}
                      <MenuButton aria-label="Menu" data-cy="avatar-button">
                        <Avatar
                          boxSize={12}
                          name={userName}
                          src={
                            session.user.userImage
                              ? session.user.userImage.base64
                              : undefined
                          }
                        />
                      </MenuButton>

                      <NavMenuList
                        email={userEmail}
                        //session={session}
                        userName={userName}
                      />
                    </Menu>

                    <Box {...popoverProps} ml={3}>
                      <OrgPopover
                        label="Mes planètes"
                        isMobile={isMobile}
                        offset={[isMobile ? 80 : 140, 15]}
                        orgType={EOrgType.NETWORK}
                        session={session}
                      />
                    </Box>
                    <Box {...popoverProps}>
                      <OrgPopover
                        isMobile={isMobile}
                        offset={[isMobile ? 22 : 140, 15]}
                        session={session}
                      />
                    </Box>
                    <Box {...popoverProps}>
                      <EventPopover
                        isMobile={isMobile}
                        offset={[isMobile ? -32 : 140, 15]}
                        session={session}
                      />
                    </Box>
                    <Box {...popoverProps}>
                      <TopicPopover
                        isMobile={isMobile}
                        offset={[isMobile ? -86 : 140, 15]}
                        session={session}
                      />
                    </Box>
                    {!isMobile && (
                      <Box {...popoverProps} mr={0}>
                        <NotificationPopover
                          isMobile={isMobile}
                          offset={[isMobile ? -141 : 140, 15]}
                          session={session}
                        />
                      </Box>
                    )}
                  </>
                </Flex>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      )}
    </Box>
  );
};
