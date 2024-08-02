import {
  Box,
  BoxProps,
  Flex,
  Alert,
  AlertIcon,
  UseDisclosureProps
} from "@chakra-ui/react";
import { useState } from "react";
import { AppHeading, EditIconButton } from "features/common";
import { Mosaic, MosaicImage } from "./Mosaic";
import { AppQueryWithData } from "utils/types";
import { IGallery } from "models/Gallery";
import { DescriptionFormModal } from "features/modals/DescriptionFormModal";
import {
  useEditGalleryMutation,
  EditGalleryPayload
} from "features/api/galleriesApi";
import { sanitize } from "utils/string";

export const UserGallery = ({
  query,
  userId,
  userName,
  description,
  images,
  marginBetween,
  onImageClick,
  ...props
}: BoxProps & {
  query: AppQueryWithData<IGallery>;
  description?: string;
  images: MosaicImage[];
  userId: string;
  userName: string;
  marginBetween: number;
  onImageClick: (image: MosaicImage) => void;
}) => {
  const gallery = query.data;
  const [editGallery] = useEditGalleryMutation();
  const [modalState, setModalState] = useState<UseDisclosureProps>({
    isOpen: false
  });
  const onOpen = async () => {
    setModalState({ ...modalState, isOpen: true });
  };
  const onClose = async () => {
    setModalState({ ...modalState, isOpen: false });
  };
  const onEditClick = () => {
    onOpen();
  };
  return (
    <Box {...props}>
      <Flex alignItems="center" my={5}>
        <AppHeading noContainer smaller>
          {userName}
        </AppHeading>
        <EditIconButton
          aria-label="Modifier la description de votre galerie"
          ml={3}
          onClick={onEditClick}
        />
      </Flex>

      {description && (
        <Alert status="info" mb={!images.length ? 0 : 3}>
          <AlertIcon />
          <div
            className="rteditor"
            dangerouslySetInnerHTML={{
              __html: sanitize(description)
            }}
          />
        </Alert>
      )}

      <Mosaic
        images={images}
        marginBetween={marginBetween}
        onImageClick={onImageClick}
      />

      {modalState.isOpen && (
        <DescriptionFormModal
          description={description}
          isOpen={modalState.isOpen}
          onCancel={() => {
            onClose();
          }}
          onClose={() => {
            onClose();
          }}
          onSubmit={async (description) => {
            const payload: EditGalleryPayload = {
              gallery: {
                ...gallery,
                galleryDescriptions: {
                  ...gallery.galleryDescriptions,
                  [userId]: description
                }
              }
            };
            await editGallery({
              galleryId: gallery._id,
              payload
            }).unwrap();
            // TODO1
            query.refetch();
            onClose();
          }}
        />
      )}
    </Box>
  );
};

{
  /* <Flex alignItems="center" p={3} justifyContent="space-between">
                  <HStack>
                    <AppHeading noContainer smaller>
                      {userName}
                    </AppHeading>
                    <Badge variant="subtle" colorScheme="green" ml={1}>
            {stringUtils.bytesForHuman(imagesSize)}
          </Badge> 
                  </HStack>
                </Flex> */
}
