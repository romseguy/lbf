import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FlexProps,
  Image,
  Menu,
  MenuButton,
  Icon,
  IconButton,
  Tooltip,
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
  Spinner
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { FaKey } from "react-icons/fa";
import { useSelector } from "react-redux";
import { css } from "twin.macro";
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
import { removeProps } from "utils/object";
import { capitalize } from "utils/string";
import { NavButtonsList } from "./NavButtonsList";
import { NavMenuList } from "./NavMenuList";

export const Nav = ({
  isMobile,
  title,
  ...props
}: FlexProps & Partial<PageProps> & { title?: string }) => {
  const { data: session } = useSession();
  const userName = session?.user.userName || "";
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const isEntityPage =
    router.pathname !== "/" &&
    !title?.includes("Forum") &&
    !router.pathname.includes("evenements");
  const userEmail = useSelector(selectUserEmail) || session?.user.email;

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
    mr: isMobile ? 2 : undefined,
    ml: isMobile ? undefined : 3,
    pt: 0.5
  };

  return (
    <Box
      as="nav"
      bg={isDark ? "gray.700" : "lightblue"}
      borderRadius="lg"
      p={3}
      pt={isMobile ? undefined : 2}
      {...removeProps(props, ["isSessionLoading"])}
    >
      <Table role="navigation">
        {!isMobile && (
          <Tbody role="rowgroup">
            {!isEntityPage && (
              <>
                <Tr role="rowheader">
                  <Td border={0} p={0}>
                    <Flex>
                      <Link href="/" variant="no-underline">
                        <Heading fontFamily="Lato">Bienvenue</Heading>
                      </Link>
                    </Flex>
                  </Td>
                  <Td border={0} display="flex" p={0}>
                    <Heading fontFamily="Lato" noContainer ml="auto">
                      {session ? session.user.userName : ""}
                    </Heading>
                  </Td>
                </Tr>
                <Tr>
                  <Td border={0} p={0}>
                    <Flex>
                      <Link
                        href="/"
                        variant="no-underline"
                        _focus={{ border: 0 }}
                      >
                        <Image height="100px" src="/images/bg.png" />
                      </Link>
                    </Flex>
                  </Td>
                  <Td border={0} p={0}>
                    <Flex alignItems="center">
                      {session && (
                        <Flex
                          as="nav"
                          bg={isDark ? "gray.800" : "lightcyan"}
                          borderColor={isDark ? "gray.600" : "gray.200"}
                          borderRadius={9999}
                          borderStyle="solid"
                          borderWidth={1}
                          ml="auto"
                          p="4px 8px 4px 8px"
                        >
                          <OrgPopover
                            orgType={EOrgType.NETWORK}
                            session={session}
                            boxSize={[6, 6, 6]}
                            mr={2}
                          />
                          <OrgPopover
                            session={session}
                            boxSize={[6, 6, 6]}
                            mr={2}
                          />
                          <EventPopover
                            boxSize={[5, 5, 5]}
                            session={session}
                            mr={3}
                          />
                          <TopicPopover
                            boxSize={[5, 5, 5]}
                            session={session}
                            mr={2}
                          />
                          <NotificationPopover
                            boxSize={[6, 6, 6]}
                            session={session}
                          />
                        </Flex>
                      )}

                      {session && userEmail && (
                        <Menu>
                          <Tooltip
                            label={`Connecté en tant que ${userEmail}`}
                            placement="left"
                          >
                            <MenuButton ml={1} data-cy="avatar-button">
                              <Avatar
                                boxSize={10}
                                name={userName}
                                src={
                                  session.user.userImage
                                    ? session.user.userImage.base64
                                    : undefined
                                }
                              />
                            </MenuButton>
                          </Tooltip>

                          <NavMenuList email={userEmail} userName={userName} />
                        </Menu>
                      )}
                    </Flex>
                  </Td>
                </Tr>
              </>
            )}
            <Tr role="row">
              <Td
                border={0}
                display="flex"
                justifyContent="space-between"
                p="28px 0 0 0"
              >
                <NavButtonsList title={title} isMobile={false} />
                {!session && (
                  <LoginButton colorScheme="cyan" bg="lightcyan">
                    Se connecter
                  </LoginButton>
                )}
              </Td>
            </Tr>
          </Tbody>
        )}

        {isMobile && (
          <Tbody role="rowgroup">
            {/* <Tr role="rowheader">
              <Td border={0} lineHeight="auto" p={0}>
                <Heading mb={1}>Bienvenue</Heading>
              </Td>
            </Tr> */}
            <Tr role="row">
              <Td border={0} p={0}>
                <Flex justifyContent="space-between">
                  <Button
                    colorScheme="cyan"
                    bg="lightcyan"
                    leftIcon={<HamburgerIcon />}
                    onClick={onDrawerOpen}
                  >
                    Ouvrir le menu
                  </Button>
                  <Drawer
                    placement="left"
                    isOpen={isDrawerOpen}
                    onClose={onDrawerClose}
                  >
                    <DrawerOverlay />
                    <DrawerContent>
                      <DrawerCloseButton />
                      <DrawerHeader>
                        {/* <Heading>{title}</Heading> */}
                      </DrawerHeader>
                      <DrawerBody>
                        <NavButtonsList
                          direction="column"
                          isMobile
                          onClose={() => {
                            if (isMobile) onDrawerClose();
                          }}
                        />
                      </DrawerBody>
                    </DrawerContent>
                  </Drawer>
                  {!session && (
                    <Tooltip label="Connexion">
                      <Button
                        colorScheme="cyan"
                        bg="lightcyan"
                        leftIcon={<Icon as={FaKey} />}
                        onClick={() => {
                          router.push("/login", "/login", {
                            shallow: true
                          });
                        }}
                      >
                        Se connecter
                      </Button>
                    </Tooltip>
                  )}
                </Flex>
              </Td>
            </Tr>

            {session && userEmail && (
              <>
                <Tr role="rowheader">
                  <Td border={0} lineHeight="auto" p={0}>
                    <Flex mt={1}>
                      <Heading>{session.user.userName}</Heading>
                    </Flex>
                  </Td>
                </Tr>
                <Tr role="row">
                  <Td border={0} p={0}>
                    <Flex mt={2}>
                      <>
                        <Box {...popoverProps}>
                          <OrgPopover
                            boxSize={6}
                            orgType={EOrgType.NETWORK}
                            session={session}
                            mx={3}
                          />
                        </Box>
                        <Box {...popoverProps}>
                          <OrgPopover boxSize={6} session={session} mx={3} />
                        </Box>
                        <Box {...popoverProps}>
                          <EventPopover boxSize={6} session={session} mx={3} />
                        </Box>
                        <Box {...popoverProps}>
                          <TopicPopover boxSize={6} session={session} mx={3} />
                        </Box>
                        <Box {...popoverProps}>
                          <NotificationPopover
                            boxSize={6}
                            session={session}
                            mx={3}
                          />
                        </Box>

                        <Menu>
                          <Tooltip
                            label={`Connecté en tant que ${userEmail}`}
                            placement="left"
                          >
                            <MenuButton data-cy="avatar-button">
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
                          </Tooltip>

                          <NavMenuList
                            email={userEmail}
                            //session={session}
                            userName={userName}
                          />
                        </Menu>
                      </>
                    </Flex>
                  </Td>
                </Tr>
              </>
            )}
          </Tbody>
        )}
      </Table>
    </Box>
  );
};

{
  /*
    <EmailLoginPopover
      iconProps={{ boxSize: [8, 10, 10] }}
      popoverProps={
        isMobile ? {} : { offset: [-140, -25] }
      }
      ml={2}
      mr={3}
    />
  */
}

{
  /*
    <EmailLoginPopover
      iconProps={{ boxSize: 8 }}
      popoverProps={{ offset: [100, -20] }}
    />
  */
}

{
  /*
    {!session && (
      <Tooltip label="Connexion">
        <IconButton
          aria-label="Connexion"
          icon={
            <Icon
              as={FaKey}
              boxSize={[8, 8, 8]}
              _hover={{ color: "#00B5D8" }}
            />
          }
          bg="transparent"
          _hover={{
            bg: "transparent",
            color: "#00B5D8"
          }}
          onClick={() => {
            router.push("/login", "/login", {
              shallow: true
            });
          }}
        />
      </Tooltip>
    )} 
  */
}
