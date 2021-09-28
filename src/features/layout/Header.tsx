import { Base64Image, getMeta } from "utils/image";
import React, { useState } from "react";
import { useRouter } from "next/router";
import tw, { css } from "twin.macro";
import {
  Box,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tag,
  Text,
  useColorMode
} from "@chakra-ui/react";
import { SpaceProps } from "@chakra-ui/system";
import { breakpoints } from "theme/theme";
import { Link } from "features/common";
import { ChatIcon } from "@chakra-ui/icons";
import { IoIosPeople } from "react-icons/io";
import { FaRegCalendarCheck, FaRegCalendarTimes } from "react-icons/fa";
import { IOrg } from "models/Org";
import { Category, IEvent } from "models/Event";

type HeaderProps = SpaceProps & {
  defaultTitle: string;
  defaultTitleColor: string;
  org?: IOrg;
  event?: IEvent;
  pageTitle?: string;
  pageSubTitle?: React.ReactNode;
};

export const Header = ({
  defaultTitle,
  defaultTitleColor,
  event,
  org,
  pageTitle,
  pageSubTitle,
  ...props
}: HeaderProps) => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  //#region local state
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const banner = event?.eventBanner || org?.orgBanner;
  const logo = event?.eventLogo || org?.orgLogo;
  const [bgHeight, setBgHeight] = useState(
    banner?.height ? banner.height : pageSubTitle ? 180 : 140
  );
  const [bgWidth, setBgWidth] = useState(banner?.width || 1154);
  if (banner?.url) {
    getMeta(banner.url, (width, height) => {
      setBgHeight(height);
      setBgWidth(width);
    });
  }
  //#endregion

  const bgImage = banner ? `url("${banner.base64 || banner.url}")` : "";
  const logoBgImage = logo ? `url("${logo.base64}")` : "";
  const logoBgWidth = "110px";
  const styles = css`
    height: ${bgHeight}px;
    background-image: ${bgImage};
    background-size: cover;
    background-repeat: no-repeat;
    ${isDark ? tw`bg-gray-800` : tw`bg-white`}
    @media (min-width: ${breakpoints["2xl"]}) {
    }
  `;

  return (
    <Flex
      as="header"
      alignItems="center"
      justifyContent="space-between"
      css={styles}
      cursor="pointer"
      onClick={(e) => {
        e.stopPropagation();
        setIsBannerModalOpen(true);
      }}
      {...props}
    >
      {logo ? (
        <Flex alignItems="center">
          <Box
            css={css`
              margin-top: ${banner?.url
                ? bgHeight - 110
                : banner
                ? banner.height - 110
                : 70}px;
              margin-bottom: 12px;
              height: ${logoBgWidth};
              width: ${logoBgWidth};
              background-image: ${logoBgImage};
              background-size: cover;
            `}
            onClick={(e) => {
              e.stopPropagation();
              setIsLogoModalOpen(true);
            }}
          />

          <Text ml={5} fontSize="larger" fontWeight="bold">
            {event?.eventName || org?.orgName}
          </Text>

          {event?.eventCategory && (
            <Tag
              ml={3}
              bgColor={
                Category[event.eventCategory || 0].bgColor === "transparent"
                  ? isDark
                    ? "whiteAlpha.300"
                    : "blackAlpha.600"
                  : Category[event.eventCategory || 0].bgColor
              }
              color="white"
            >
              {Category[event.eventCategory || 0].label}
            </Tag>
          )}
        </Flex>
      ) : (
        <Flex flexDirection="column" ml={5}>
          <Link
            variant="no-underline"
            fontFamily="Aladin"
            fontSize="x-large"
            fontStyle="italic"
            mt={!pageSubTitle ? 5 : undefined}
            //mb={!pageTitle ? 5 : undefined}
            color={defaultTitleColor}
            onClick={() => router.push("/", "/", { shallow: true })}
          >
            {defaultTitle}
          </Link>

          {org || event || pageTitle ? (
            <>
              <Link href={router.asPath} variant="no-underline">
                <Text
                  as="h1"
                  className="rainbow-text"
                  fontSize={["3xl", "3xl", pageSubTitle ? "3xl" : "6xl"]}
                  py={3}
                  pt={0}
                  display="flex"
                  alignItems="center"
                >
                  {org || event ? (
                    <Icon
                      mr={3}
                      as={
                        org
                          ? IoIosPeople
                          : event?.isApproved
                          ? FaRegCalendarCheck
                          : FaRegCalendarTimes
                      }
                    />
                  ) : (
                    pageTitle === "Forum" && <Icon mr={3} as={ChatIcon} />
                  )}

                  {org ? org.orgName : event ? event.eventName : pageTitle}
                </Text>
              </Link>
              {event ? (
                <Box>
                  <Tag
                    bgColor={
                      Category[event.eventCategory || 0].bgColor ===
                      "transparent"
                        ? isDark
                          ? "whiteAlpha.300"
                          : "blackAlpha.600"
                        : Category[event.eventCategory || 0].bgColor
                    }
                    color="white"
                  >
                    {Category[event.eventCategory || 0].label}
                  </Tag>
                </Box>
              ) : (
                pageSubTitle
              )}
            </>
          ) : null}
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
                  <Box
                    bg={bgImage}
                    bgRepeat="no-repeat"
                    height={bgHeight}
                    width={bgWidth}
                    alignSelf="center"
                  ></Box>
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
