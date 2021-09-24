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
import { IEvent } from "models/Event";

type HeaderProps = SpaceProps & {
  logo?: Base64Image;
  headerBg?: Base64Image & { url?: string };
  defaultTitle: string;
  defaultTitleColor: string;
  org?: IOrg;
  event?: IEvent;
  pageTitle?: string;
  pageSubTitle?: React.ReactNode;
};

export const Header = ({
  headerBg,
  defaultTitle,
  defaultTitleColor,
  event,
  org,
  pageTitle,
  pageSubTitle,
  logo,
  ...props
}: HeaderProps) => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  //#region local state
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const [bgHeight, setBgHeight] = useState(
    headerBg && headerBg.height ? headerBg.height : pageSubTitle ? 180 : 140
  );
  const [bgWidth, setBgWidth] = useState(headerBg?.width || 0);
  if (headerBg) {
    if (headerBg.url) {
      getMeta(headerBg.url, (width, height) => {
        setBgHeight(height);
        setBgWidth(width);
      });
    }
  }
  //#endregion

  const bgImage = headerBg ? `url("${headerBg.base64 || headerBg.url}")` : "";
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
      <Flex direction="column" ml={5}>
        {logo ? (
          <Box
            css={css`
              margin-top: ${headerBg?.url
                ? bgHeight - 110
                : headerBg
                ? headerBg.height - 110
                : 180 - 110}px;
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
        ) : (
          <>
            <Link
              variant="no-underline"
              fontFamily="Aladin"
              fontSize="x-large"
              fontStyle="italic"
              mt={!pageSubTitle ? 5 : undefined}
              mb={!pageTitle ? 5 : undefined}
              color={defaultTitleColor}
              onClick={() => router.push("/", "/", { shallow: true })}
            >
              {defaultTitle}
            </Link>

            {pageTitle ? (
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

                  {pageTitle}
                </Text>
              </Link>
            ) : null}
          </>
        )}

        {pageSubTitle && <Text as="h3">{pageSubTitle}</Text>}
      </Flex>

      {org &&
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
                  Bannière de {org.orgName}
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
                    Logo de {org.orgName}
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
