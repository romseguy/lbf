import { ChatIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Heading,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tag,
  useColorMode,
  SpaceProps
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { IoIosGitNetwork, IoIosPeople } from "react-icons/io";
import { FaRegCalendarCheck, FaRegCalendarTimes } from "react-icons/fa";
import tw, { css } from "twin.macro";
import { Link } from "features/common";
import { IOrg, OrgTypes } from "models/Org";
import { Category, IEvent } from "models/Event";
import { breakpoints } from "theme/theme";

export const Header = ({
  defaultTitle,
  event,
  org,
  pageTitle,
  pageSubTitle,
  ...props
}: SpaceProps & {
  defaultTitle: string;
  org?: IOrg;
  event?: IEvent;
  pageTitle?: string;
  pageSubTitle?: React.ReactNode;
}) => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  //#region local state
  const [classNameTitle, setClassNameTitle] = useState("");
  const icon =
    pageTitle === "Forum"
      ? ChatIcon
      : pageTitle === "Organisations"
      ? IoIosPeople
      : pageTitle === "Réseaux"
      ? IoIosGitNetwork
      : org
      ? org.orgType === OrgTypes.NETWORK
        ? IoIosGitNetwork
        : IoIosPeople
      : event
      ? event.isApproved
        ? FaRegCalendarCheck
        : FaRegCalendarTimes
      : null;

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const banner = event?.eventBanner || org?.orgBanner;

  const bgImage = banner ? `url("${banner.base64 || banner.url}")` : undefined;
  const logo = event?.eventLogo || org?.orgLogo;
  const logoBgImage = logo ? `url("${logo.url || logo.base64}")` : "";
  const logoBgSize = "110px";
  //#endregion

  const HeaderTitle = () => (
    <Flex
      alignItems="center"
      bg={"whiteAlpha.400"}
      borderRadius="lg"
      p={4}
      ml={logo ? 5 : undefined}
    >
      {icon && (
        <Icon
          as={icon}
          boxSize={5}
          color={event ? (event.isApproved ? "green" : "red") : "green"}
          mr={2}
          title={
            event?.isApproved
              ? "Événement approuvé"
              : event
              ? "Événement en attente de modération"
              : undefined
          }
        />
      )}

      <Box
        display="flex"
        alignItems="center"
        color={banner ? "white" : undefined}
        className={classNameTitle}
        onMouseEnter={() => setClassNameTitle("rainbow-text")}
        onMouseLeave={() => setClassNameTitle("")}
      >
        <Link href={router.asPath} variant="no-underline">
          <Heading fontFamily="DancingScript" size="lg">
            {org
              ? org.orgName
              : event
              ? event.eventName
              : pageTitle || defaultTitle}
          </Heading>
        </Link>
      </Box>
    </Flex>
  );

  const HeaderEventCategory = () => {
    if (!event || !event.eventCategory) return null;
    return (
      <Tag
        bgColor={
          Category[event.eventCategory || 0].bgColor === "transparent"
            ? isDark
              ? "whiteAlpha.300"
              : "blackAlpha.600"
            : Category[event.eventCategory || 0].bgColor
        }
        color="white"
        ml={2}
      >
        {Category[event.eventCategory].label}
      </Tag>
    );
  };

  return (
    <Flex
      as="header"
      alignItems="center"
      color={isDark ? "white" : "black"}
      cursor={banner ? "pointer" : "default"}
      height={banner ? banner.headerHeight : undefined}
      p={!banner && !logo ? 3 : undefined}
      css={css`
        ${isDark ? tw`bg-gray-800` : tw`bg-white`}
        background-image: ${bgImage};
        background-size: cover;
        background-repeat: no-repeat;
      `}
      onClick={(e) => {
        e.stopPropagation();
        setIsBannerModalOpen(true);
      }}
      {...props}
    >
      {logo ? (
        <>
          <Link
            alignSelf="flex-end"
            onClick={(e) => {
              e.stopPropagation();
              setIsLogoModalOpen(true);
            }}
          >
            <Image
              src={logo.url || logo.base64}
              borderTopRightRadius="lg"
              height={logoBgSize}
            />
          </Link>
          <HeaderTitle />
          <HeaderEventCategory />
        </>
      ) : (
        <Flex
          alignItems="center"
          bg={banner ? "whiteAlpha.400" : undefined}
          borderRadius="lg"
          ml={5}
          p={banner ? 3 : undefined}
        >
          <HeaderTitle />
          <HeaderEventCategory />
        </Flex>
      )}

      {banner &&
        (isBannerModalOpen ? (
          <Modal
            size="full"
            isOpen
            closeOnOverlayClick
            onClose={() => {
              setIsBannerModalOpen(false);
            }}
          >
            <ModalOverlay>
              <ModalContent bg="transparent" mt={0} minHeight="auto">
                <ModalHeader bg="blackAlpha.700" color="white">
                  Bannière de {org ? org.orgName : event ? event.eventName : ""}
                </ModalHeader>
                <ModalCloseButton color="white" />
                <ModalBody display="flex" flexDirection="column" p={0}>
                  <Image
                    src={banner.url || banner.base64}
                    height={banner.height || 140}
                    width={banner.width || 1154}
                  />
                </ModalBody>
              </ModalContent>
            </ModalOverlay>
          </Modal>
        ) : (
          logo &&
          isLogoModalOpen && (
            <Modal
              size="full"
              isOpen
              closeOnOverlayClick
              onClose={() => {
                setIsLogoModalOpen(false);
              }}
            >
              <ModalOverlay>
                <ModalContent bg="transparent" mt={0} minHeight="auto">
                  <ModalHeader bg="blackAlpha.700" color="white">
                    Logo de {org ? org.orgName : event ? event.eventName : ""}
                  </ModalHeader>
                  <ModalCloseButton color="white" />
                  <ModalBody display="flex" flexDirection="column" p={0}>
                    <Box
                      bg={logoBgImage}
                      bgRepeat="no-repeat"
                      height={logo.height}
                      width={logo.width}
                      alignSelf="center"
                    ></Box>
                  </ModalBody>
                </ModalContent>
              </ModalOverlay>
            </Modal>
          )
        ))}
    </Flex>
  );
};
