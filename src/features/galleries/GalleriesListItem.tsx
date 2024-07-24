import {
  AddIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  EditIcon,
  Icon
} from "@chakra-ui/icons";
import {
  Badge,
  Box,
  BoxProps,
  Flex,
  IconButton,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Tooltip,
  Tr,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  Button,
  DeleteButton,
  Column,
  PushPinSlashIcon,
  PushPinIcon
} from "features/common";
import { useSession } from "hooks/useSession";
import { IGallery } from "models/Gallery";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";
import { useRouter } from "next/router";
import { FaFolderOpen, FaFolder } from "react-icons/fa";
import { css } from "twin.macro";
import { DocumentsListMasonry } from "features/documents/DocumentsListMasonry";
import {
  IndexedRemoteImage,
  useGetDocumentsQuery
} from "features/api/documentsApi";
import { DocumentForm } from "features/forms/DocumentForm";
import { ServerError } from "utils/errors";
import { useEditGalleryMutation } from "features/api/galleriesApi";
import { AppQueryWithData } from "utils/types";
import { IOrg } from "models/Org";

export const GalleriesListItem = ({
  query,
  gallery,
  galleryIndex,
  isCurrent,
  isLoading,
  setIsLoading,
  isGalleryCreator,
  ...props
}: BoxProps & {
  query: AppQueryWithData<IOrg>;
  gallery: IGallery;
  galleryIndex: number;
  isCreator: boolean;
  isCurrent: boolean;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  isGalleryCreator: boolean;
  onClick: () => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();
  const { data: session } = useSession();
  const toast = useToast({ position: "top" });
  const [editGallery] = useEditGalleryMutation();

  const [isAdd, setIsAdd] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const hoverColor = isHover ? "white" : "black";

  const documentsQuery = useGetDocumentsQuery(
    {
      galleryId: gallery._id
    },
    {
      selectFromResult: ({ data = [], ...rest }) => {
        let images: IndexedRemoteImage[] = [];
        let imagesSize = 0;

        let index = 0;

        for (const file of data) {
          if ("height" in file) {
            if ("bytes" in file) imagesSize += file.bytes;

            images.push({
              ...file,
              index,
              url: `${process.env.NEXT_PUBLIC_FILES}/${
                gallery._id
              }/${encodeURIComponent(file.url)}`
            });
            index++;
          }
        }
        images = images.sort((a, b) =>
          !!a.time && !!b.time ? (a.time < b.time ? 1 : -1) : 0
        );

        return { ...rest, data, images, imagesSize };
      }
    }
  );
  const { images, imagesSize } = documentsQuery;

  // const isSubbedToGallery = !!subQuery.data?.galleries?.find(
  //   (galleriesubscription) => {
  //     if (!galleriesubscription.gallery) return false;
  //     return galleriesubscription.gallery._id === gallery._id;
  //   }
  // );

  const onAddDocumentClick = () => {
    setIsAdd(!isAdd);
  };

  return (
    <Box key={gallery._id} {...props}>
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
        onClick={props.onClick}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <Flex
          flexDirection="column"
          flexGrow={1}
          //px={2}
          ml={2}
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
                  <Tooltip label={`${images.length} image(s)`}>
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
                      {images.length > 0 && (
                        <Badge
                          bgColor={isDark ? "teal.600" : "teal.100"}
                          color={isDark ? "white" : "black"}
                          pos="absolute"
                          variant="solid"
                          left={1}
                        >
                          {images.length}
                        </Badge>
                      )}
                    </Box>
                  </Tooltip>
                </Td>

                <Td>
                  {/* {gallery.galleryCategory && (
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
                            )} */}

                  <Text fontWeight="bold">{gallery.galleryName}</Text>
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
                            {gallery.galleryNotifications.length} membre{s}{" "}
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
          {...(isMobile ? { pb: 1, pt: 3 } : {})}
        >
          {isLoading && <Spinner mr={3} mt={1} mb={2} />}

          {!isLoading && session && (
            <>
              {props.isCreator && (
                <>
                  {/* <Tooltip
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
                  </Tooltip> */}

                  <Tooltip placement="bottom" label="Épingler la galerie">
                    <IconButton
                      aria-label="Épingler la galerie"
                      icon={
                        gallery.isPinned ? (
                          <PushPinSlashIcon />
                        ) : (
                          <PushPinIcon />
                        )
                      }
                      variant="outline"
                      colorScheme="teal"
                      mr={3}
                      onClick={async (e) => {
                        e.stopPropagation();
                        setIsLoading({
                          [gallery._id]: true
                        });
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
                          setIsLoading({
                            [gallery._id]: false
                          });
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
                        //onEditClick();
                      }}
                    />
                  </Tooltip>

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
                      //onDeleteClick();
                    }}
                    data-cy="gallery-list-item-delete"
                  />
                </>
              )}
            </>
          )}

          {!isLoading && (
            <Flex>
              {/* {session && (
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
                        )} */}

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
                  onClick={props.onClick}
                />
              </Tooltip>
            </Flex>
          )}
        </Flex>
      </Flex>

      {isCurrent && (
        <Box bg={isDark ? "#314356" : "orange.50"} pb={5}>
          {/*
          <GridItem px={3} py={2} data-cy="topic-subscribers">
            <TopicsListItemSubscribers
              topic={topic}
              isSubbedToTopic={isSubbedToTopic}
            />
          </GridItem>
          */}

          {/* <TopicMessagesList
            isEdit={isEdit}
            query={query}
            setIsEdit={setIsEdit}
            topic={topic}
            px={3}
            pb={3}
          /> */}

          <DocumentsListMasonry
            gallery={gallery}
            bg="transparent"
            images={images}
            imagesSize={imagesSize}
            isGalleryCreator={isGalleryCreator}
            isLoading={false}
            isFetching={false}
            position="bottom"
            onDelete={() => {
              documentsQuery.refetch();
            }}
          />

          <Button
            colorScheme="teal"
            leftIcon={<AddIcon />}
            m={3}
            onClick={onAddDocumentClick}
          >
            Ajouter une photo à cette galerie
          </Button>

          {isAdd && (
            <Column mx={3}>
              <DocumentForm
                gallery={gallery}
                onSubmit={() => {
                  documentsQuery.refetch();
                  setIsAdd(false);
                }}
              />
            </Column>
          )}
        </Box>
      )}
    </Box>
  );

  // return (
  //   <GalleriesListItem
  //     key={gallery._id}
  //     isMobile={isMobile}
  //     session={session}
  //     isCreator={props.isCreator}
  //     query={query}
  //     subQuery={subQuery}
  //     currentGalleryName={currentGalleryName}
  //     gallery={gallery}
  //     galleryIndex={galleryIndex}
  //     isSubbedToGallery={isSubbedToGallery}
  //     isCurrent={isCurrent}
  //     isGalleryCreator={isGalleryCreator}
  //     isDark={isDark}
  //     //isLoading={isLoading[gallery._id] || query.isLoading}
  //     //setIsLoading={setIsLoading}
  //     selectedCategories={selectedCategories}
  //     setSelectedCategories={setSelectedCategories}
  //     notifyModalState={notifyModalState}
  //     setNotifyModalState={setNotifyModalState}
  //     galleryModalState={galleryModalState}
  //     setGalleryModalState={setGalleryModalState}
  //     mb={galleryIndex < galleries.length - 1 ? 5 : 0}
  //     // onClick={onClick}
  //     // onDeleteClick={onDeleteClick}
  //     // onEditClick={onEditClick}
  //     // onNotifClick={onNotifClick}
  //     // onSubscribeClick={onSubscribeClick}
  //   />
  // );
};
