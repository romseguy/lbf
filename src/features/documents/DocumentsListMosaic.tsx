import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spinner,
  Text,
  useColorMode,
  UseDisclosureProps,
  useToast
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useDeleteDocumentMutation } from "features/api/documentsApi";
import { AppHeading, DeleteButton } from "features/common";
import { FullscreenModal } from "features/modals/FullscreenModal";
import { selectScreenHeight } from "store/uiSlice";
import { hasItems } from "utils/array";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon
} from "@chakra-ui/icons";
import { IGallery } from "models/Gallery";
import { downloadImage } from "utils/image";
import { useGetGalleryQuery } from "features/api/galleriesApi";
import { getRefId } from "models/Entity";
import { Mosaic, MosaicImage } from "./Mosaic";

export const DocumentsListMosaic = ({
  gallery,
  isCreator,
  isGalleryCreator,
  isLoading,
  position = "top",
  groupByUser,
  onDelete,
  ...props
}: {
  gallery?: IGallery;
  isCreator?: boolean;
  isGalleryCreator?: boolean;
  images?: MosaicImage[];
  imagesSize?: number;
  isLoading: boolean;
  position?: "top" | "bottom";
  groupByUser?: boolean;
  onDelete?: () => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const toast = useToast({ position: "top" });
  const [deleteDocument] = useDeleteDocumentMutation();
  const screenHeight = useSelector(selectScreenHeight);

  const [marginBetween, setMarginBetween] = useState<number>(15);

  //#region images
  const galleryQuery = useGetGalleryQuery({ galleryId: gallery?._id });
  useEffect(() => {
    galleryQuery.refetch();
  }, [isLoading]);

  const galleryDocuments =
    (galleryQuery.data || gallery || {}).galleryDocuments || [];
  const imagesByUser: Record<string, MosaicImage[]> = {};
  const images =
    props.images ||
    galleryDocuments.map((doc, index) => {
      let image: MosaicImage = {
        index,
        name: doc.documentName,
        id: doc._id,
        url: `${process.env.NEXT_PUBLIC_FILES}/${doc._id}`,
        height: doc.documentHeight,
        width: doc.documentWidth,
        bytes: doc.documentBytes
      };

      if (
        doc.createdBy &&
        typeof doc.createdBy !== "string" &&
        "userName" in doc.createdBy &&
        groupByUser
      ) {
        const userName = doc.createdBy.userName;
        const userEntry = imagesByUser[userName];
        imagesByUser[userName] = userEntry
          ? userEntry.concat([image])
          : [image];
      }

      return image;
    }) ||
    [];
  const imagesSize =
    props.imagesSize || images.reduce((total, image) => image.bytes, 0);
  //#endregion

  //#region modal state
  const [modalState, setModalState] = useState<
    UseDisclosureProps & { image?: MosaicImage }
  >({
    isOpen: false
  });
  const onClose = () =>
    setModalState({
      ...modalState,
      isOpen: false,
      image: undefined
    });
  const onOpen = async (image: MosaicImage) => {
    setModalState({ ...modalState, isOpen: true, image });
  };
  //#endregion

  const handleChange = (valueString: number | string) => {
    setMarginBetween(
      typeof valueString === "string" ? Number(valueString) : valueString
    );
  };

  const config = (
    <Flex alignItems="center" mb={3}>
      <Text mx={5}>Marges</Text>
      <NumberInput
        maxW="100px"
        allowMouseWheel
        value={marginBetween}
        //min={0}
        //max={200}
        onChange={handleChange}
      >
        <NumberInputField
          bgColor="white"
          color={isDark ? "black" : undefined}
        />
        <NumberInputStepper>
          <NumberIncrementStepper
            bg="green.200"
            color={isDark ? "black" : undefined}
            // _active={{ bg: "green.300" }}
            children="+"
          />
          <NumberDecrementStepper
            bg="pink.200"
            color={isDark ? "black" : undefined}
            // _active={{ bg: "pink.300" }}
            children="-"
          />
        </NumberInputStepper>
      </NumberInput>
      <Slider
        flex="1"
        focusThumbOnChange={false}
        value={marginBetween}
        onChange={handleChange}
        mx={10}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb
          color="black"
          fontSize="sm"
          boxSize="32px"
          children={marginBetween}
        />
      </Slider>
    </Flex>
  );

  return (
    <>
      {images.length > 0 && position === "top" && (
        <>
          {config}
          <Box as="hr" mb={5} />
        </>
      )}

      {isLoading ? (
        <Spinner m={3} />
      ) : !hasItems(images) ? (
        <Alert status="info">
          <AlertIcon />
          Aucune photos.
        </Alert>
      ) : groupByUser ? (
        <>
          {Object.keys(imagesByUser).map((userName) => {
            const images = imagesByUser[userName];
            return (
              <React.Fragment key={userName}>
                <Flex alignItems="center" p={3} justifyContent="space-between">
                  <HStack>
                    <AppHeading noContainer smaller>
                      {userName}
                    </AppHeading>
                    {/* <Badge variant="subtle" colorScheme="green" ml={1}>
            {stringUtils.bytesForHuman(imagesSize)}
          </Badge> */}
                  </HStack>
                </Flex>
                <Mosaic
                  images={images}
                  marginBetween={marginBetween}
                  onImageClick={(image) => onOpen(image)}
                />
              </React.Fragment>
            );
          })}
        </>
      ) : (
        <Mosaic
          images={images}
          marginBetween={marginBetween}
          onImageClick={(image) => onOpen(image)}
        />
      )}

      {images.length > 0 && position === "bottom" && (
        <>
          <Box as="hr" mt={5} pt={5} />
          {config}
        </>
      )}

      {modalState.isOpen && modalState.image && (
        <FullscreenModal
          //header={images[modalState.index].url.match(/[^=]+$/)![0]}
          header={
            <HStack>
              <IconButton
                aria-label="Précédent"
                colorScheme="teal"
                icon={<ChevronLeftIcon boxSize={10} />}
                isDisabled={modalState.image.index - 1 < 0}
                onClick={() => {
                  //@ts-ignore
                  const index = modalState.image.index - 1;
                  setModalState({
                    ...modalState,
                    image: images[index < 0 ? 0 : index]
                  });
                }}
              />
              <IconButton
                aria-label="Suivant"
                colorScheme="teal"
                icon={<ChevronRightIcon boxSize={10} />}
                isDisabled={modalState.image.index + 1 >= images.length}
                onClick={() => {
                  //@ts-ignore
                  const index = modalState.image.index + 1;
                  setModalState({
                    ...modalState,
                    image: images[index > images.length ? images.length : index]
                  });
                }}
              />

              <FaImage />
              <Text>
                {/* {images[modalState.image.index].url.substring(
                  images[modalState.image.index].url.lastIndexOf("/") + 1
                )} */}
                {modalState.image.name}
              </Text>

              <IconButton
                aria-label="Télécharger"
                colorScheme="teal"
                icon={<DownloadIcon />}
                onClick={() => {
                  downloadImage(
                    `${process.env.NEXT_PUBLIC_API}/documents/download?id=${modalState.image?.id}&fileName=${modalState.image?.name}`,
                    modalState.image?.name || ""
                  );
                }}
              />

              {isGalleryCreator && gallery && (
                <DeleteButton
                  variant="solid"
                  header={
                    <>
                      Êtes vous sûr de vouloir supprimer l'image{" "}
                      {modalState.image.name}
                      {/* <Text display="inline" color="red" fontWeight="bold">
                      {modalState.image.url.match(urlFilenameR)[0]}
                    </Text>{" "} */}
                      ?
                    </>
                  }
                  isIconOnly
                  isSmall={false}
                  placement="bottom"
                  onClick={async () => {
                    const [...parts] = modalState.image!.url.split("/");
                    const fileName = parts[parts.length - 1];

                    try {
                      await deleteDocument(fileName).unwrap();
                      //await api.remove(process.env.NEXT_PUBLIC_API2, payload);
                      toast({
                        title: `L'image a été supprimée !`,
                        status: "success"
                      });
                      setModalState({ isOpen: false });
                      galleryQuery.refetch();
                      onDelete && onDelete();
                    } catch (error) {
                      console.error(error);
                      toast({
                        title: `L'image n'a pas pu être supprimée.`,
                        status: "error"
                      });
                    }
                  }}
                />
              )}
            </HStack>
          }
          bodyProps={{ bg: "black" }}
          onClose={onClose}
        >
          <Image
            alignSelf="center"
            src={images[modalState.image.index].url}
            maxHeight={screenHeight - 72 + "px"}
            //width={`${images[modalState.index].width}px`}
          />
        </FullscreenModal>
      )}
    </>
  );
};

{
  /* <Flex alignItems="center" p={3} justifyContent="space-between">
        <HStack>
          <AppHeading noContainer smaller>
            {images.length} photos
          </AppHeading>
          <Badge variant="subtle" colorScheme="green" ml={1}>
            {stringUtils.bytesForHuman(imagesSize)}
          </Badge>
        </HStack>
      </Flex> */
}
