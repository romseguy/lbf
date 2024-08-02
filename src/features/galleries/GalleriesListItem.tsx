import { AddIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  BoxProps,
  useColorMode
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Button } from "features/common";
import { IGallery } from "models/Gallery";
import { DocumentsListMosaic } from "features/documents/DocumentsListMosaic";
import { DocumentForm } from "features/forms/DocumentForm";
import { AppQueryWithData } from "utils/types";
import { hasItems } from "utils/array";
import { IEntity, isEvent, isOrg } from "models/Entity";
import { sanitize } from "utils/string";
import { GalleriesListItemHeader } from "./GalleriesListItemHeader";
import { removeProps } from "utils/object";
import { useScroll } from "hooks/useScroll";

export const GalleriesListItem = ({
  query,
  gallery,
  galleryIndex,
  isCreator,
  isGalleryCreator,
  isCurrent,
  isLoading,
  setIsLoading,
  noHeader = false,
  //onClick,
  onEditClick,
  ...props
}: BoxProps & {
  query: AppQueryWithData<IEntity>;
  gallery?: IGallery;
  galleryIndex: number;
  isCreator: boolean;
  isGalleryCreator: boolean;
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
  const [executeScroll, elementToScrollRef] = useScroll<HTMLDivElement>();

  const entity = query.data;
  const isO = isOrg(entity);
  const isE = isEvent(entity);

  const [isAdd, setIsAdd] = useState(false);

  const onAddDocumentClick = () => {
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
          executeScroll={executeScroll}
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
                <Alert status="info">
                  <AlertIcon />
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
