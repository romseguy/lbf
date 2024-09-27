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
  HStack,
  VStack
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import { useSelector } from "react-redux";
import { css } from "twin.macro";
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

  const FirstCell = (
    <HStack spacing={3}>
      {router.pathname !== "/" && router.asPath !== "/photo" && (
        <>
          <Tooltip label="Retour" placement="right">
            <IconButton
              aria-label="Retour"
              colorScheme="purple"
              icon={<Icon as={FaArrowLeft} />}
              onClick={() => {
                if (window.history?.length && window.history.length > 1) {
                  router.back();
                } else {
                  router.replace("/");
                }
              }}
            />
          </Tooltip>

          {isE && (
            <Tooltip label="Revenir à l'accueil" placement="right">
              <IconButton
                aria-label="Revenir à l'accueil"
                colorScheme="purple"
                icon={<Icon as={FaHome} boxSize={8} />}
                onClick={() => {
                  // router.push(
                  //   `/${entity.eventOrgs[0].orgUrl}`,
                  //   `/${entity.eventOrgs[0].orgUrl}`,
                  //   { shallow: true }
                  // )
                  router.push(`/photo`, `/photo`, { shallow: true });
                }}
              />
            </Tooltip>
          )}
        </>
      )}

      {isO && <Text fontSize="4xl">{OrgTypes[entity.orgType]} :</Text>}

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
  );

  const SecondCell = (
    <HStack justifyContent="flex-end">
      {isSessionLoading ? (
        <Spinner />
      ) : (
        session && (
          <>
            <Menu>
              {/* <Tooltip
                        label={`Connecté en tant que ${userEmail}`}
                        placement="left"
                      >
                      </Tooltip> */}
              <MenuButton aria-label="Menu">
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
          </>
        )
      )}

      <Tooltip
        label={`Basculer vers le thème ${isDark ? "clair" : "sombre"}`}
        hasArrow
      >
        <Box>
          <DarkModeSwitch />
        </Box>
      </Tooltip>
    </HStack>
  );

  return (
    <Box as="nav" {...props}>
      {!isMobile && (
        <Table
          role="navigation"
          css={css`
            td {
              border: 0;
              padding: 0;
            }
          `}
        >
          <Tbody>
            <Tr>
              <Td>{FirstCell}</Td>
              <Td>{SecondCell}</Td>
            </Tr>
          </Tbody>
        </Table>
      )}

      {isMobile && (
        <VStack alignItems="flex-start" mb={3}>
          {FirstCell}
          {SecondCell}{" "}
        </VStack>
      )}
    </Box>
  );
};

{
  /* {isMobile && !session && (
        <LoginButton colorScheme="cyan" bg="lightcyan" mb={1}>
          Se connecter
        </LoginButton>
      )} */
}
