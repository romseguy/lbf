import { Flex, Alert, AlertIcon, UseDisclosureProps } from "@chakra-ui/react";
import { useState } from "react";
import { AppHeading, EditIconButton } from "features/common";
import { Mosaic, MosaicImage } from "./Mosaic";
import { AppQueryWithData } from "utils/types";
import { IGallery } from "models/Gallery";
import { DescriptionFormModal } from "features/modals/DescriptionFormModal";

export const UserGallery = ({
  query,
  userName,
  description,
  images,
  marginBetween,
  onImageClick
}: {
  query: AppQueryWithData<IGallery>;
  description?: string;
  images: MosaicImage[];
  userName: string;
  marginBetween: number;
  onImageClick: (image: MosaicImage) => void;
}) => {
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
    <>
      <Flex alignItems="center" ml={3}>
        <AppHeading noContainer smaller>
          {userName}
        </AppHeading>
        <EditIconButton
          aria-label="Modifier la description de votre galerie"
          ml={3}
          onClick={onEditClick}
        />
      </Flex>
      <Alert status="info" my={3}>
        <AlertIcon />
        {description}
      </Alert>

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
          onSubmit={(description) => {
            console.log("🚀 ~ description:", description);
          }}
        />
      )}
    </>
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
