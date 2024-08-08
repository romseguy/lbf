import {
  CalendarIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  EditIcon,
  Icon
} from "@chakra-ui/icons";
import {
  Badge,
  Box,
  BoxProps,
  Button,
  Flex,
  HStack,
  IconButton,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Tooltip,
  Tr,
  useColorMode
} from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import React, { useState } from "react";
import { DeleteButton, PushPinSlashIcon, PushPinIcon } from "features/common";
import { useSession } from "hooks/useSession";
import { IGallery } from "models/Gallery";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";
import { useRouter } from "next/router";
import { FaFolderOpen, FaFolder, FaImages } from "react-icons/fa";
import { css } from "twin.macro";
import { ServerError } from "utils/errors";
import {
  useDeleteGalleryMutation,
  useEditGalleryMutation
} from "features/api/galleriesApi";
import { AppQueryWithData } from "utils/types";
import { hasItems } from "utils/array";
import { IEntity, isEvent, isOrg } from "models/Entity";
import { IOrg } from "models/Org";

export const GalleriesListItemHeader = ({
  query,
  gallery,
  galleryIndex,
  isCreator,
  isGalleryCreator,
  isCurrent,
  isLoading,
  setIsLoading,
  noHeader = false,
  executeScroll,
  //onClick,
  onEditClick,
  ...props
}: BoxProps & {
  query: AppQueryWithData<IEntity>;
  gallery: IGallery;
  galleryIndex: number;
  isCreator: boolean;
  isGalleryCreator: boolean;
  isCurrent: boolean;
  isLoading?: boolean;
  setIsLoading?: (isLoading: boolean) => void;
  noHeader?: boolean;
  executeScroll?: () => void;
  //onClick?: () => void;
  onEditClick?: () => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();
  const { data: session } = useSession();
  const toast = useToast({ position: "top" });
  const [deleteGallery] = useDeleteGalleryMutation();
  const [editGallery] = useEditGalleryMutation();

  const org = query.data as IOrg;
  const event = org.orgEvents.find(({ _id }) => _id === gallery.galleryName);
  const isEventGallery = !!event;

  const [isHover, setIsHover] = useState(false);
  const baseUrl = `/${org.orgUrl}/galeries`;
  const hoverColor = isHover ? "white" : "black";

  const onDeleteClick = async () => {
    try {
      setIsLoading && setIsLoading(true);
      const deletedGallery = await deleteGallery(gallery!._id).unwrap();
      toast({
        title: `La galerie « ${deletedGallery.galleryName} » a été supprimée !`,
        status: "success"
      });
      router.push(baseUrl, baseUrl, { shallow: true });
    } catch (error: ServerError | any) {
      toast({
        title:
          error.data.message ||
          `La galerie « ${gallery!.galleryName} » n'a pas pu être supprimée`,
        status: "error"
      });
    } finally {
      setIsLoading && setIsLoading(false);
    }
  };

  const onClick = async () => {
    let url = isEventGallery
      ? `/${event.eventUrl}/galerie`
      : "/" + org.orgUrl + "/galeries";

    if (!isEventGallery && !isCurrent) {
      url += "/" + gallery.galleryName;
    }

    await router.push(url, url, { shallow: true });
    //if (!isEventGallery) executeScroll();
  };

  return (
    <Flex
      alignItems={isMobile ? "flex-start" : "center"}
      flexDir={isMobile ? "column" : "row"}
      borderTopRadius="xl"
      borderBottomRadius={!isCurrent ? "lg" : undefined}
      bg={
        galleryIndex % 2 === 0
          ? isDark
            ? "gray.600"
            : "orange.200"
          : isDark
          ? "gray.500"
          : "orange.100"
      }
      cursor="pointer"
      py={1}
      _hover={{ bg: isDark ? "#314356" : "orange.300" }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Flex
        flexDirection="column"
        flexGrow={1}
        //px={2}
        ml={2}
        onClick={onClick}
      >
        {/* Header */}
        <Table
          css={css`
            td {
              border: none;
              padding: 0;
            }
            td:last-of-type {
              width: 100%;
            }
          `}
        >
          <Tbody>
            <Tr>
              <Td>
                <Tooltip label={`${gallery.galleryDocuments?.length} image(s)`}>
                  <Box pos="relative">
                    {isCurrent ? (
                      <Icon
                        as={FaFolderOpen}
                        //alignSelf="center"
                        boxSize={7}
                        color={isDark ? "teal.200" : "teal"}
                        mr={2}
                      />
                    ) : (
                      <Icon
                        as={FaFolder}
                        boxSize={7}
                        color={isDark ? "teal.200" : "teal"}
                        mr={2}
                      />
                    )}

                    {hasItems(gallery.galleryDocuments) && (
                      <Badge
                        bgColor={isDark ? "teal.600" : "teal.100"}
                        color={isDark ? "white" : "black"}
                        pos="absolute"
                        variant="solid"
                        left={1}
                      >
                        {gallery.galleryDocuments?.length}
                      </Badge>
                    )}
                  </Box>
                </Tooltip>
              </Td>

              <Td>
                {isEventGallery ? (
                  <CalendarIcon mr={1} mt={-1} />
                ) : (
                  <Icon as={FaImages} mr={1} mt={1} />
                )}
              </Td>

              <Td>
                <HStack>
                  <Text>Galerie {isEventGallery && "de l'événement"} : </Text>
                  <Text fontWeight="bold">
                    {event?.eventName || gallery.galleryName}
                  </Text>
                </HStack>
              </Td>
            </Tr>
          </Tbody>
        </Table>

        {/* SubHeader */}
        <Flex
          alignItems="center"
          flexWrap="wrap"
          fontSize="smaller"
          color={isDark ? "white" : "purple"}
          ml={10}
        >
          {/* Un descriptif de la galerie */}
          {/* <Tooltip label="Aller à la page de l'utilisateur">
                        <Link
                          href={`/${galleryCreatedByUserName}`}
                          _hover={{
                            color: isDark ? "white" : "white",
                            textDecoration: "underline"
                          }}
                        >
                          {galleryCreatedByUserName}
                        </Link>
                      </Tooltip> */}
          {/* <Box as="span" aria-hidden mx={1}>
                        ·
                      </Box> */}
          {/* <Tooltip
                        placement="bottom"
                        label={`Galerie créée le ${fullDate}`}
                      >
                        <Text
                          cursor="default"
                          // _hover={{
                          //   color: isDark ? "white" : "white"
                          // }}
                          onClick={(e) => e.stopPropagation()}
                          suppressHydrationWarning
                        >
                          {timeAgo}
                        </Text>
                      </Tooltip> */}
          {/* <Box as="span" aria-hidden mx={1}>
                        ·
                      </Box> */}
          {/* <GallerysListItemVisibility
                        query={query}
                        gallery={gallery}
                        //icon props
                        color={isDark ? "white" : "purple"}
                        cursor="default"
                        css={css`
                          vertical-align: middle;
                        `}
                        onClick={(e) => e.stopPropagation()}
                      /> */}
          {/* <Box as="span" aria-hidden mx={1}>
                        ·
                      </Box> */}
          {/* <GallerysListItemShare
                        aria-label="Partager la galerie"
                        gallery={gallery}
                        color={isDark ? "white" : "purple"}
                      /> */}
          {/* {isCreator && (
                        <>
                          <Box as="span" aria-hidden mx={1}>
                            ·
                          </Box>
                           <Link
                      _hover={{
                        color: isDark ? "white" : "white",
                        textDecoration: "underline"
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNotifClick(gallery);
                      }}
                    > 
                          <Text
                            cursor="default"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {gallery.galleryNotifications.length} participant{s}{" "}
                            invité
                            {s}
                          </Text>
                           </Link> 
                        </>
                      )} */}
        </Flex>
      </Flex>

      <Flex
        alignItems="center"
        // pt={3}
        // pb={2}
        ml={2}
        {...(isMobile ? {} : {})}
      >
        {isLoading && <Spinner mr={3} mt={1} mb={2} />}

        {!isLoading && session && (
          <Flex>
            {isCreator && (
              <>
                <Tooltip placement="bottom" label="Épingler la galerie">
                  <IconButton
                    aria-label="Épingler la galerie"
                    icon={
                      gallery.isPinned ? <PushPinSlashIcon /> : <PushPinIcon />
                    }
                    variant="outline"
                    colorScheme="teal"
                    mr={3}
                    onClick={async (e) => {
                      e.stopPropagation();
                      setIsLoading && setIsLoading(true);
                      try {
                        await editGallery({
                          payload: {
                            gallery: { isPinned: !gallery.isPinned }
                          },
                          galleryId: gallery._id
                        }).unwrap();
                        query.refetch();
                      } catch (error: ServerError | any) {
                        toast({
                          title:
                            error.data.message ||
                            `La galerie ${gallery.galleryName} n'a pas pu être épinglée`,
                          status: "error"
                        });
                      } finally {
                        setIsLoading && setIsLoading(false);
                      }
                    }}
                  />
                </Tooltip>
              </>
            )}

            {isGalleryCreator && (
              <>
                <Tooltip placement="bottom" label="Modifier la galerie">
                  <IconButton
                    aria-label="Modifier la galerie"
                    icon={<EditIcon />}
                    colorScheme="green"
                    variant="outline"
                    mr={3}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditClick && onEditClick();
                    }}
                  />
                </Tooltip>

                {!isEventGallery && (
                  <DeleteButton
                    header={
                      <>
                        Êtes vous sûr de vouloir supprimer la galerie
                        <Text display="inline" color="red" fontWeight="bold">
                          {` ${gallery.galleryName}`}
                        </Text>{" "}
                        ?
                      </>
                    }
                    isIconOnly
                    isSmall={false}
                    label="Supprimer la galerie"
                    mr={3}
                    placement="bottom"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteClick();
                    }}
                    data-cy="gallery-list-item-delete"
                  />
                )}
              </>
            )}
          </Flex>
        )}

        {!isLoading && (
          <Flex>
            {isMobile ? (
              <Button colorScheme="teal" onClick={onClick}>
                Ouvrir
              </Button>
            ) : (
              <Tooltip
                placement="left"
                label={`${isCurrent ? "Fermer" : "Ouvrir"} la galerie`}
              >
                <IconButton
                  aria-label={`${isCurrent ? "Fermer" : "Ouvrir"} la galerie`}
                  icon={
                    isCurrent ? (
                      <ChevronUpIcon color={hoverColor} boxSize={9} />
                    ) : (
                      <ChevronRightIcon color={hoverColor} boxSize={9} />
                    )
                  }
                  bg="transparent"
                  height="auto"
                  minWidth={0}
                  _hover={{
                    background: "transparent",
                    color: isDark ? "teal.100" : "white"
                  }}
                  onClick={onClick}
                />
              </Tooltip>
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

{
  /* {gallery.galleryCategory && (
                              <Tooltip
                                label={
                                  !hasCategorySelected
                                    ? `Afficher les galeries de la catégorie ${galleryCategoryLabel}`
                                    : ""
                                }
                                hasArrow
                              >
                                <Button
                                  //alignSelf="flex-start"
                                  colorScheme={
                                    hasCategorySelected ? "pink" : "teal"
                                  }
                                  fontSize="small"
                                  fontWeight="normal"
                                  height="auto"
                                  mr={1}
                                  py={1}
                                  px={0}
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    if (hasCategorySelected)
                                      setSelectedCategories(
                                        selectedCategories!.filter(
                                          (category) =>
                                            category !== gallery.galleryCategory
                                        )
                                      );
                                    else if (gallery.galleryCategory)
                                      setSelectedCategories([
                                        ...(selectedCategories || []),
                                        gallery.galleryCategory
                                      ]);
                                  }}
                                >
                                  {galleryCategoryLabel}
                                </Button>
                              </Tooltip>
                            )} */
}

{
  /* {session && (
                          <Tooltip
                            label={
                              isSubbedToGallery
                                ? "Se désabonner de la galerie"
                                : "S'abonner à la galerie"
                            }
                          >
                            <IconButton
                              aria-label={
                                isSubbedToGallery
                                  ? "Se désabonner de la galerie"
                                  : "S'abonner à la galerie"
                              }
                              icon={
                                isSubbedToGallery ? <FaBellSlash /> : <FaBell />
                              }
                              variant="outline"
                              colorScheme="blue"
                              mr={3}
                              onClick={async (e) => {
                                e.stopPropagation();
                                onSubscribeClick();
                              }}
                              data-cy={
                                isSubbedToGallery
                                  ? "gallery-list-item-unsubscribe"
                                  : "gallery-list-item-subscribe"
                              }
                            />
                          </Tooltip>
                        )} */
}

{
  /* <Tooltip
                    placement="bottom"
                    label="Envoyer des invitations à la galerie"
                  >
                    <IconButton
                      aria-label="Envoyer des invitations à la galerie"
                      icon={<EmailIcon />}
                      variant="outline"
                      colorScheme="blue"
                      mr={3}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNotifClick();
                      }}
                    />
                  </Tooltip> */
}
