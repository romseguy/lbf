import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  BoxProps,
  Flex,
  Menu,
  MenuButton,
  useColorMode,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  Table,
  Tbody,
  Tr,
  Td,
  IconButton
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

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose
  } = useDisclosure();

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
      {isMobile && (
        <Box position="fixed" right={3} top={3}>
          <IconButton
            aria-label="Ouvrir le menu"
            colorScheme="cyan"
            bg="lightcyan"
            icon={<HamburgerIcon />}
            border="1px solid black"
            onClick={onDrawerOpen}
          />
          <Drawer
            placement="left"
            isOpen={isDrawerOpen}
            onClose={onDrawerClose}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>{/* <Heading>{title}</Heading> */}</DrawerHeader>
              <DrawerBody>
                <NavButtonsList
                  direction="column"
                  onClose={() => {
                    if (isMobile) onDrawerClose();
                  }}
                />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Box>
      )}

      <Table role="navigation" mb={isMobile ? 0 : 2}>
        <Tbody role="rowgroup">
          {!isMobile && (
            <Tr role="rowheader">
              <Td border={0} p={0}>
                <Heading mb={2}>
                  <Link href="/" shallow>
                    {process.env.NEXT_PUBLIC_SHORT_URL}
                  </Link>
                </Heading>
              </Td>
            </Tr>
          )}

          <Tr role="row">
            <Td border={0} p={isMobile ? "12px 0 0 0" : "16px 0 0 0"}>
              {!isMobile && <NavButtonsList title={title} />}
              {!session && isMobile && (
                <LoginButton
                  colorScheme="cyan"
                  bg="lightcyan"
                  mt={!isMobile ? 3 : undefined}
                >
                  Se connecter
                </LoginButton>
              )}
            </Td>
            {!session && !isMobile && (
              <Td border={0} p={0} textAlign="right">
                <LoginButton colorScheme="cyan" bg="lightcyan">
                  Se connecter
                </LoginButton>
              </Td>
            )}
          </Tr>
        </Tbody>
      </Table>

      {session && userEmail && (
        <Table
          role="navigation"
          bg={isDark ? "gray.700" : "gray.200"}
          borderRadius="lg"
          width={isMobile ? undefined : "auto"}
          mb={isMobile ? 2 : 0}
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
