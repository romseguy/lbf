import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  BoxProps,
  Flex,
  Menu,
  MenuButton,
  Icon,
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
import { FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Heading, LoginButton } from "features/common";
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
import { NavButtonsList } from "./NavButtonsList";
import { NavMenuList } from "./NavMenuList";

export const Nav = ({
  isMobile,
  title,
  ...props
}: BoxProps & PageProps & { title?: string }) => {
  const { data: session } = useSession();
  const userName = session?.user.userName || "";
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const isEntityPage =
    Array.isArray(router.query.name) &&
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
    mr: isMobile ? 1 : 3,
    pt: 0.5
  };

  const NavMenuButton = (
    <>
      <IconButton
        aria-label="Ouvrir le menu"
        colorScheme="cyan"
        bg="lightcyan"
        icon={<HamburgerIcon />}
        border="1px solid black"
        onClick={onDrawerOpen}
      />
      <Drawer placement="left" isOpen={isDrawerOpen} onClose={onDrawerClose}>
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
    </>
  );

  return (
    <Box as="nav" {...removeProps(props, ["isSessionLoading"])}>
      {isMobile && (
        <Box position="fixed" right={3} top={3}>
          {NavMenuButton}
        </Box>
      )}

      <Table role="navigation" mb={isMobile ? 0 : 2}>
        <Tbody role="rowgroup">
          {!isMobile && (
            <Tr role="rowheader">
              <Td border={0} p={0}>
                <Heading mb={2}>{process.env.NEXT_PUBLIC_SHORT_URL}</Heading>
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

                      <NavMenuList
                        email={userEmail}
                        //session={session}
                        userName={userName}
                      />
                    </Menu>

                    <Box {...popoverProps} mx={isMobile ? 2 : 3}>
                      <OrgPopover
                        isMobile={isMobile}
                        offset={[isMobile ? 110 : 140, 15]}
                        orgType={EOrgType.NETWORK}
                        session={session}
                      />
                    </Box>
                    <Box {...popoverProps}>
                      <OrgPopover
                        isMobile={isMobile}
                        offset={[isMobile ? 110 : 140, 15]}
                        session={session}
                      />
                    </Box>
                    <Box {...popoverProps}>
                      <EventPopover isMobile={isMobile} session={session} />
                    </Box>
                    <Box {...popoverProps}>
                      <TopicPopover
                        isMobile={isMobile}
                        offset={[isMobile ? -55 : 140, 15]}
                        session={session}
                      />
                    </Box>
                    <Box {...popoverProps} mr={0}>
                      <NotificationPopover
                        isMobile={isMobile}
                        offset={[isMobile ? 100 : 140, 15]}
                        session={session}
                      />
                    </Box>
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

{
  /*
    <Tr role="row">
      <Td
        alignItems="center"
        border={0}
        display="flex"
        fontSize="sm"
        p={0}
      >
        {typeof window !== "undefined" &&
        window.history?.state?.idx > 0 ? (
          <Link onClick={() => router.back()}>
            <ChevronLeftIcon /> Retour
          </Link>
        ) : (
          <>
            <ChevronLeftIcon /> Retour
          </>
        )}
      </Td>
    </Tr>
  */
}

{
  /*
    <Text fontSize="sm">
      {typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : ""}
      {router.query && Array.isArray(router.query.name)
        ? router.query.name.reduce((acc, value, index) => {
            if (index > 0) return acc + "/" + value;
            return value;
          }, "")
        : router.asPath}
    </Text>
 */
}

{
  /* {!isEntityPage && (
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

                            <NavMenuList
                              email={userEmail}
                              userName={userName}
                            />
                          </Menu>
                        )}
                      </Flex>
                    </Td>
                  </Tr>
                </>
              )} */
}

{
  /* {isMobile && (
        <>
           <Tr role="rowheader">
              <Td border={0} lineHeight="auto" p={0}>
                <Heading mb={1}>Bienvenue</Heading>
              </Td>
            </Tr>
          <Tr role="row">
            <Td border={0} p={0}>
              {session && isEntityPage && (
                <NavButtonsList title={title} isMobile />
              )}

              {session && !isEntityPage && NavMenuButton}

              {!session && (
                <Flex justifyContent="space-between">
                  {NavMenuButton}

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
                </Flex>
              )}
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
        </>
      )} */
}
