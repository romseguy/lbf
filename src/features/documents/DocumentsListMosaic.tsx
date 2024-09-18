import {
  Alert,
  AlertIcon,
  Box,
  Flex,
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
  UseDisclosureProps
} from "@chakra-ui/react";

import React, { useState } from "react";
import { useSelector } from "react-redux";

import { IGallery } from "models/Gallery";
import { selectIsMobile } from "store/uiSlice";
import { hasItems } from "utils/array";
import { AppQuery, AppQueryWithData } from "utils/types";
import { Mosaic, MosaicImage } from "./Mosaic";
import { UserGallery } from "./UserGallery";
import { MosaicItemFullscrenModal } from "./MosaicItemFullscrenModal";
import { getRefId, IEntity } from "models/Entity";
import theme from "features/layout/theme";
import { equals } from "utils/string";
import { useSession } from "hooks/useSession";

export const DocumentsListMosaic = ({
  entity,
  gallery,
  //galleryQuery,
  isCreator,
  isGalleryCreator,
  isLoading,
  position = "top",
  groupByUser,
  onDelete,
  ...props
}: {
  entity: IEntity;
  gallery: IGallery;
  //galleryQuery: AppQuery<IGallery>;
  isCreator?: boolean;
  isGalleryCreator?: boolean;
  imagesSize?: number;
  isLoading: boolean;
  position?: "top" | "bottom";
  groupByUser?: boolean;
  onDelete?: () => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { data: session } = useSession();
  const isMobile = useSelector(selectIsMobile);
  const [marginBetween, setMarginBetween] = useState<number>(15);

  //#region images
  const galleryByUser: Record<
    string,
    { description?: string; images: MosaicImage[]; userName: string }
  > = {};
  const images =
    gallery?.galleryDocuments?.map((doc, index) => {
      let image: MosaicImage = {
        index,
        name: doc.documentName,
        id: doc._id,
        url: `${process.env.NEXT_PUBLIC_FILES}/${doc._id}`,
        height: doc.documentHeight,
        width: doc.documentWidth,
        bytes: doc.documentBytes,
        isCreator: equals(getRefId(doc), session?.user.userId),
        createdBy: doc.createdBy
      };

      if (
        doc.createdBy &&
        typeof doc.createdBy !== "string" &&
        "_id" in doc.createdBy &&
        "userName" in doc.createdBy &&
        groupByUser
      ) {
        //console.log(doc.createdBy._id);

        const userId = doc.createdBy._id;
        const userName = doc.createdBy.userName;
        const userEntry = galleryByUser[userId];
        const description = gallery?.galleryDescriptions[userId];

        if (userEntry) {
          galleryByUser[userId] = {
            ...userEntry,
            description,
            images: userEntry.images.concat([image]),
            userName
          };
        } else {
          galleryByUser[userId] = {
            description,
            images: [image],
            userName
          };
        }
      }

      return image;
    }) || [];
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
          {/* <Box as="hr" mt={5} mb={5} /> */}
          {config}
          <Box as="hr" />
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
          {Object.keys(galleryByUser).map((userId, index) => {
            const { description, images, userName } = galleryByUser[userId];
            return (
              <UserGallery
                key={userId}
                gallery={gallery}
                //query={galleryQuery}
                userId={userId}
                userName={userName}
                description={description}
                images={images}
                marginBetween={marginBetween}
                onImageClick={(image) => onOpen(image)}
                {...(index !== Object.keys(galleryByUser).length - 1
                  ? {
                      borderBottom: `1px solid ${
                        isDark
                          ? theme.colors.whiteAlpha[300]
                          : theme.colors.gray[200]
                      }`,
                      pb: isMobile ? 0 : 10
                    }
                  : {})}
              />
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
        <MosaicItemFullscrenModal
          entity={entity}
          images={images}
          isGalleryCreator={isGalleryCreator}
          //@ts-expect-error
          modalState={modalState}
          //@ts-expect-error
          setModalState={setModalState}
          onOpen={onOpen}
          onClose={onClose}
        />
      )}
    </>
  );
};
