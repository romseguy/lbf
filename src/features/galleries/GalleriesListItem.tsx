import { AddIcon } from "@chakra-ui/icons";
import { Alert, Box, BoxProps, useColorMode } from "@chakra-ui/react";
import React, { useState } from "react";
import { Button } from "features/common";
import { DocumentsListMosaic } from "features/documents/DocumentsListMosaic";
import {
  DocumentForm,
  maxNumberOfDocumentsPerUser
} from "features/forms/DocumentForm";
import { useScroll } from "hooks/useScroll";
import { useSession } from "hooks/useSession";
import { useToast } from "hooks/useToast";
import { getRefId, IEntity, isEvent, isOrg } from "models/Entity";
import { IGallery } from "models/Gallery";
import { getEmail } from "models/Subscription";
import { hasItems } from "utils/array";
import { removeProps } from "utils/object";
import { equals, sanitize } from "utils/string";
import { AppQueryWithData } from "utils/types";
import { GalleriesListItemHeader } from "./GalleriesListItemHeader";

export const GalleriesListItem = ({
  gallery,
  query,
  galleryIndex,
  isCreator,
  isCurrent,
  isLoading,
  setIsLoading,
  noHeader = false,
  //onClick,
  onEditClick,
  ...props
}: BoxProps & {
  gallery: IGallery;
  query: AppQueryWithData<IEntity>;
  galleryIndex: number;
  isCreator: boolean;
  isCurrent: boolean;
  isLoading?: boolean;
  setIsLoading?: (isLoading: boolean) => void;
  noHeader?: boolean;
  //onClick?: () => void;
  onAddDocumentClick?: () => void;
  onEditClick?: () => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { data: session } = useSession();
  const toast = useToast();
  const [executeScroll, elementToScrollRef] = useScroll<HTMLDivElement>();

  const entity = query.data;
  const isO = isOrg(entity);
  const isE = isEvent(entity);
  const isGalleryCreator =
    isCreator || equals(getRefId(gallery), session?.user.userId);
  const attendees = (
    isO ? entity.orgLists : isE ? entity.eventOrgs[0].orgLists : []
  ).find(({ listName }) => listName === "Participants");
  const isAttendee =
    session?.user.isAdmin ||
    !!(attendees?.subscriptions || []).find(
      (sub) => getEmail(sub) === session?.user.email
    );
  // const galleryId = entity._id;
  // const galleryQuery = useGetGalleryQuery({
  //   galleryId
  // }) as AppQuery<IGallery>;
  // const gallery = props.gallery || galleryQuery.data;
  const [isAdd, setIsAdd] = useState(false);

  const onAddDocumentClick = () => {
    if (!isAttendee)
      return toast({
        title:
          "Vous devez avoir été inscrit en tant que participant de l'atelier pour ajouter des photos"
      });

    const userDocuments = gallery.galleryDocuments.filter((doc) =>
      equals(session?.user.userId, getRefId(doc))
    );

    if (userDocuments.length >= maxNumberOfDocumentsPerUser) {
      return toast({
        title: `Vous avez atteint la limite de ${maxNumberOfDocumentsPerUser} photos pour cet atelier`
      });
    }

    props.onAddDocumentClick ? props.onAddDocumentClick() : setIsAdd(!isAdd);
  };

  if (!gallery) return null;

  return (
    <Box {...removeProps(props, ["onAddDocumentClick"])}>
      {!noHeader && (
        <GalleriesListItemHeader
          query={query}
          gallery={gallery}
          galleryIndex={galleryIndex}
          isCreator={isCreator}
          isGalleryCreator={isGalleryCreator}
          isCurrent={isCurrent}
          //executeScroll={executeScroll}
          //onClick={onClick}
          onEditClick={onEditClick}
        />
      )}

      {isCurrent && (
        <Box
          {...(noHeader
            ? {}
            : {
                bg: isDark ? "#314356" : "orange.50",
                p: 3,
                ref: elementToScrollRef
              })}
        >
          <Button
            aria-label="Ajouter des photos"
            colorScheme={isAdd ? "red" : "teal"}
            leftIcon={isAdd ? undefined : <AddIcon />}
            mb={3}
            onClick={onAddDocumentClick}
          >
            {isAdd ? "Annuler" : "Ajouter des photos"}
          </Button>

          {!isAdd && (
            <Box>
              {gallery.galleryDescription && (
                <Alert status="info" mb={3}>
                  {/* <AlertIcon /> */}
                  <div className="rteditor">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: sanitize(gallery.galleryDescription)
                      }}
                    />
                  </div>
                </Alert>
              )}

              {((isE && hasItems(gallery.galleryDocuments)) ||
                (!isE && hasItems(gallery.galleryDocuments))) && (
                <DocumentsListMosaic
                  entity={entity}
                  gallery={gallery}
                  isGalleryCreator={isGalleryCreator}
                  isLoading={isAdd}
                  position="top"
                  groupByUser={isE}
                  onDelete={() => {
                    if (isO) query.refetch();
                  }}
                />
              )}
            </Box>
          )}

          {isAdd && (
            <>
              <DocumentForm
                bg={isDark ? "whiteAlpha.100" : "blackAlpha.100"}
                p={3}
                gallery={gallery}
                remainingDocumentsCount={
                  isO
                    ? undefined
                    : maxNumberOfDocumentsPerUser -
                      gallery.galleryDocuments.filter((doc) =>
                        equals(session?.user.userId, getRefId(doc))
                      ).length
                }
                onSubmit={() => {
                  // TODO1
                  // dispatch setRefreshDiskUsage(!refreshDiskUsage);
                  setIsAdd(false);
                }}
              />
            </>
          )}
        </Box>
      )}
    </Box>
  );
};
