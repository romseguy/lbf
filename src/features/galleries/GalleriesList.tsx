import { AddIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  GridProps,
  List,
  ListItem,
  Select,
  Spinner,
  Text,
  useColorMode
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Button, AppHeading, CategoryTag } from "features/common";
import { useSession } from "hooks/useSession";
import { getCategoryLabel, getRefId, IEntity, isOrg } from "models/Entity";
import { AppQueryWithData } from "utils/types";
import { IGallery } from "models/Gallery";
import { GalleryFormModal } from "features/modals/GalleryFormModal";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";
import { useRouter } from "next/router";
import { GalleriesListItem } from "./GalleriesListItem";
import { normalize } from "utils/string";
import { isBefore, parseISO } from "date-fns";

enum EGalleriesListOrder {
  ALPHA = "ALPHA",
  NEWEST = "NEWEST",
  OLDEST = "OLDEST",
  PINNED = "PINNED"
}

export type GalleryModalState = {
  isOpen: boolean;
  gallery?: IGallery;
};

export const GalleriesList = ({
  query,
  currentGalleryName,
  ...props
}: GridProps & {
  query: AppQueryWithData<IEntity>;
  isCreator: boolean;
  currentGalleryName?: string;
  onSubmit?: (gallery: IGallery) => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const { data: session } = useSession();
  const isMobile = useSelector(selectIsMobile);
  const entity = query.data;
  const isO = isOrg(entity);

  //#region local state
  const [isGalleryLoading, setIsGalleryLoading] = useState<
    Record<string, boolean>
  >({});

  const defaultOrder = EGalleriesListOrder.NEWEST;
  const [selectedOrder, setSelectedOrder] =
    useState<EGalleriesListOrder>(defaultOrder);
  const galleries = [
    ...(isO
      ? entity.orgGalleries.concat(
          entity.orgEvents.map((event) => {
            return {
              _id: "event" + event.eventUrl,
              galleryName: event.eventName,
              isPinned: true,
              createdAt: event.eventMinDate
            };
          })
        )
      : entity.eventGalleries || [])
  ].sort((galleryA, galleryB) => {
    if (galleryA.isPinned && !galleryB.isPinned) return -1;
    if (!galleryA.isPinned && galleryB.isPinned) return 1;

    if (selectedOrder === EGalleriesListOrder.ALPHA)
      return galleryA.galleryName > galleryB.galleryName ? 1 : -1;

    const dateA = parseISO(galleryA.createdAt);
    const dateB = parseISO(galleryB.createdAt);

    if (selectedOrder === EGalleriesListOrder.OLDEST)
      return isBefore(dateA, dateB) ? -1 : 1;

    return isBefore(dateB, dateA) ? -1 : 1;
  });
  const currentGallery = galleries.find(({ galleryName }) => {
    return galleryName === currentGalleryName;
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>();
  const galleryCategories = entity.orgGalleryCategories || [];

  //const [selectedLists, setSelectedLists] = useState<IOrgList[]>();
  //#endregion

  //#region gallery modal state
  const [galleryModalState, setGalleryModalState] = useState<GalleryModalState>(
    {
      isOpen: false
      //!!currentGalleryName && ["ajouter", "a"].includes(currentGalleryName)
    }
  );
  const onClose = () =>
    setGalleryModalState({
      ...galleryModalState,
      isOpen: false,
      gallery: undefined
    });

  const onAddClick = () => {
    setGalleryModalState({ ...galleryModalState, isOpen: true });
  };
  //#endregion

  return (
    <>
      <Box>
        <Button
          colorScheme="teal"
          leftIcon={<AddIcon />}
          mb={3}
          onClick={onAddClick}
        >
          Ajouter une galerie
        </Button>
      </Box>

      <Box mb={5}>
        <AppHeading smaller>Ordre d'affichage</AppHeading>

        <Select
          defaultValue={defaultOrder}
          width="275px"
          onChange={(e) => {
            //@ts-ignore
            setSelectedOrder(e.target.value);
          }}
        >
          <option value={EGalleriesListOrder.ALPHA}>
            Dans l'ordre alphabétique
          </option>
          {/* <option value={EGalleriesListOrder.PINNED}>Épinglé</option> */}
          <option value={EGalleriesListOrder.NEWEST}>
            Du plus récent au plus ancien
          </option>
          <option value={EGalleriesListOrder.OLDEST}>
            Du plus ancien au plus récent
          </option>
        </Select>
      </Box>

      <Box>
        {query.isLoading ? (
          <Spinner />
        ) : !galleries.length ? (
          <Alert status="warning" mb={3}>
            <AlertIcon />
            <Flex flexDirection="column">
              {selectedCategories && selectedCategories.length >= 1 ? (
                //|| (selectedLists && selectedLists.length >= 1)
                <>
                  {selectedCategories && selectedCategories.length >= 1 ? (
                    <>
                      Aucune galeries appartenant :
                      <List listStyleType="square" ml={5}>
                        <ListItem mb={1}>
                          aux catégories :
                          {selectedCategories.map((catId, index) => (
                            <>
                              <CategoryTag key={index} mx={1}>
                                {getCategoryLabel(galleryCategories, catId)}
                              </CategoryTag>
                              {index !== selectedCategories.length - 1 && "ou"}
                            </>
                          ))}
                        </ListItem>
                        {/* <ListItem>
                          aux listes :
                          {selectedLists.map(({ listName }, index) => (
                            <>
                              <CategoryTag mx={1}>{listName}</CategoryTag>
                              {index !== selectedLists.length - 1 && "ou"}
                            </>
                          ))}
                        </ListItem> */}
                      </List>
                    </>
                  ) : selectedCategories && selectedCategories.length >= 1 ? (
                    <Box>
                      {selectedCategories.length === 1 ? (
                        <>
                          Aucune galeries appartenant à la catégorie{" "}
                          <CategoryTag>
                            {getCategoryLabel(
                              galleryCategories,
                              selectedCategories[0]
                            )}
                          </CategoryTag>
                        </>
                      ) : (
                        <>
                          Aucune galeries appartenant aux catégories
                          {selectedCategories.map((catId, index) => (
                            <>
                              <CategoryTag key={index} mx={1}>
                                {getCategoryLabel(galleryCategories, catId)}
                              </CategoryTag>
                              {index !== selectedCategories.length - 1 && "ou"}
                            </>
                          ))}
                        </>
                      )}
                    </Box>
                  ) : (
                    // selectedLists && selectedLists.length >= 1 ? (
                    //   <Box>
                    //     {selectedLists.length === 1 ? (
                    //       <>
                    //         Aucune galeries appartenant à la liste{" "}
                    //         <CategoryTag>{selectedLists[0].listName}</CategoryTag>
                    //       </>
                    //     ) : (
                    //       <>
                    //         Aucune galeries appartenant aux listes
                    //         {selectedLists.map(({ listName }, index) => (
                    //           <>
                    //             <CategoryTag mx={1}>{listName}</CategoryTag>
                    //             {index !== selectedLists.length - 1 && "ou"}
                    //           </>
                    //         ))}
                    //       </>
                    //     )}
                    //   </Box>
                    // ) : (
                    <>todo</>
                  )}
                </>
              ) : (
                <Text>Aucune galeries.</Text>
              )}
            </Flex>
          </Alert>
        ) : (
          galleries.map((gallery, galleryIndex) => {
            const isCurrent = gallery._id === currentGallery?._id;
            const isLoading = isGalleryLoading[gallery._id];
            const isGalleryCreator =
              props.isCreator || getRefId(gallery) === session?.user.userId;

            const onClick = async () => {
              if (gallery._id.includes("event")) {
                const url = `/${gallery._id.substring(5) + "/galerie"}`;
                await router.push(url, url, { shallow: true });
              } else {
                let url = "/" + entity.orgUrl + "/galeries";

                if (!isCurrent) {
                  url += "/" + normalize(gallery.galleryName);
                  await router.push(url, url, { shallow: true });
                  //executeScroll();
                } else {
                  await router.push(url, url, { shallow: true });
                }
              }
            };

            return (
              <GalleriesListItem
                key={gallery._id}
                query={query}
                gallery={gallery}
                galleryIndex={galleryIndex}
                isCreator={props.isCreator}
                isCurrent={isCurrent}
                isLoading={isLoading}
                setIsLoading={setIsGalleryLoading}
                isGalleryCreator={isGalleryCreator}
                mb={galleryIndex < galleries.length - 1 ? 5 : 0}
                onClick={onClick}
                onEditClick={() => {
                  setGalleryModalState({
                    ...galleryModalState,
                    isOpen: true,
                    gallery
                  });
                }}
              />
            );
          })
        )}
      </Box>

      {galleryModalState.isOpen && (
        <GalleryFormModal
          {...galleryModalState}
          query={query}
          isCreator={props.isCreator}
          onCancel={onClose}
          onSubmit={async (gallery) => {
            // const galleryName = normalize(gallery.galleryName);
            // const url = `${baseUrl}/${galleryName}`;
            // await router.push(url, url, { shallow: true });
            //query.refetch();
            props.onSubmit && props.onSubmit(gallery);
            onClose();
          }}
          onClose={onClose}
        />
      )}
    </>
  );
};

{
  /* <Box
        {...(isMobile
          ? {}
          : { display: "flex", justifyContent: "space-between" })}
      >
        {(props.isCreator || galleryCategories.length > 0) && (
          <Flex flexDirection="column" mb={3}>
            <AppHeading smaller>Catégories</AppHeading>

            <GalleriesListCategories
              query={query}
              isCreator={props.isCreator}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </Flex>
        )}

        {isO &&
          entity.orgUrl !== "forum" &&
          session &&
          hasItems(entity.orgLists) && (
            <Flex flexDirection="column" mb={3}>
              <AppHeading smaller>Listes</AppHeading>
              <GalleriesListOrgLists
                org={entity}
                isCreator={props.isCreator}
                session={session}
                subQuery={subQuery}
                //selectedLists={selectedLists}
                //setSelectedLists={setSelectedLists}
              />
            </Flex>
          )}
      </Box> */
}
{
  /* {session && (
        <EntityNotifModal
          query={query}
          mutation={addGalleryNotifMutation}
          setModalState={setNotifyModalState}
          modalState={notifyModalState}
          session={session}
        />
      )} */
}
