import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
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
import { IndexedRemoteImage } from "features/api/documentsApi";
import { Column, ColumnProps, AppHeading, DeleteButton } from "features/common";
import { pxBreakpoints } from "features/layout/theme";
import { FullscreenModal } from "features/modals/FullscreenModal";
import { selectScreenHeight, selectScreenWidth } from "store/uiSlice";
import { divideArray, hasItems } from "utils/array";
import * as stringUtils from "utils/string";
import { useRouter } from "next/router";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon
} from "@chakra-ui/icons";
import { IGallery } from "models/Gallery";
import api from "utils/api";

export const DocumentsListMasonry = ({
  gallery,
  isCreator,
  isGalleryCreator,
  images,
  imagesSize,
  isLoading,
  isFetching,
  position = "top",
  ...props
}: Omit<ColumnProps, "position"> & {
  gallery?: IGallery;
  isCreator?: boolean;
  isGalleryCreator?: boolean;
  images: IndexedRemoteImage[];
  imagesSize: number;
  isLoading: boolean;
  isFetching: boolean;
  position?: "top" | "bottom";
  onDelete?: () => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const toast = useToast({ position: "top" });
  const screenHeight = useSelector(selectScreenHeight);
  const screenWidth = useSelector(selectScreenWidth);

  //#region column count relative to screen width
  const [columnCount, setColumnCount] = useState<number>(1);
  const [marginBetween, setMarginBetween] = useState<number>(15);

  useEffect(() => {
    const getColumnCount = () => {
      let col = 1;
      if (hasItems(images) && screenWidth) {
        if (screenWidth >= pxBreakpoints.xl)
          col = images.length >= 4 ? 4 : images.length;
        else if (screenWidth >= pxBreakpoints.lg) col = 3;
        else if (screenWidth >= pxBreakpoints.md) col = 2;
        else col = 1;
      }
      return col;
    };
    const col = getColumnCount();
    if (col !== columnCount) setColumnCount(col);
  }, [router.asPath, images, screenWidth]);
  //#endregion

  //#region masonry state
  const [currentIndex, setCurrentIndex] = useState(0);
  const pageImageCount = 10;
  const pagesCount =
    images.length > pageImageCount ? images.length % pageImageCount : 1;
  //const pageLength = images.length / pagesCount;
  const pages = divideArray(images, pagesCount);
  const masonry = divideArray(
    pages.reduce(
      (arr, page, index) => (index <= currentIndex ? arr.concat(page) : arr),
      []
    ),
    columnCount
  );
  //#endregion

  //#region modal state
  const [modalState, setModalState] = useState<
    UseDisclosureProps & { image?: IndexedRemoteImage }
  >({
    isOpen: false
  });
  const onClose = () =>
    setModalState({
      ...modalState,
      isOpen: false,
      image: undefined
    });
  const onOpen = async (image: IndexedRemoteImage) => {
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
    <Column {...props}>
      <Flex alignItems="center" p={3} justifyContent="space-between">
        <HStack>
          <AppHeading noContainer smaller>
            {images.length} images
          </AppHeading>
          <Badge variant="subtle" colorScheme="green" ml={1}>
            {stringUtils.bytesForHuman(imagesSize)}
          </Badge>
        </HStack>
        {/* <Flex> */}
        {/* <Text>Marges</Text> */}
        {/* </Flex> */}
      </Flex>

      {position === "top" && (
        <>
          {config}
          <Box as="hr" mb={5} />
        </>
      )}

      {isLoading || isFetching ? (
        <Spinner m={3} />
      ) : !hasItems(images) ? (
        <Alert status="info">
          <AlertIcon />
          Aucune images.
        </Alert>
      ) : (
        !!columnCount && (
          <>
            <Flex>
              {masonry.map((column, columnIndex) => {
                // console.log(
                // "🚀 ~ {masonry.map ~ column :",
                // columnIndex,
                // column
                // );

                return (
                  <Flex key={columnIndex} flexDir="column">
                    {column.map((image, rowIndex) => {
                      // console.log("🚀 ~ {column.map ~ row index:", rowIndex);

                      let marginAround = 2 * (4 * 12 + 24);
                      marginAround = 0;
                      //const marginBetween = (columnCount - 1) * 24;
                      let newMW = screenWidth - marginAround;

                      if (screenWidth > pxBreakpoints["2xl"]) {
                        marginAround = 2 * (5 * 12 + 20 + 84);
                        marginAround = 0;
                        // newMW =
                        //   (screenWidth - marginAround - marginBetween) /
                        //   columnCount;
                        newMW = (screenWidth - marginAround) / columnCount;
                        // console.log(
                        //   "1",
                        //   columnCount,
                        //   screenWidth,
                        //   newMW,
                        //   marginAround,
                        //   marginBetween
                        // );
                      } else if (columnCount !== 1) {
                        marginAround = 2 * (4 * 12 + 20);
                        marginAround = 0;
                        // newMW =
                        //   (screenWidth - marginAround - marginBetween) /
                        //   columnCount;
                        newMW = (screenWidth - marginAround) / columnCount;
                      }

                      let width = image.width > newMW ? newMW : image.width;

                      // if (columnIndex / (columnCount - 1) !== 1) {
                      //   width -= marginBetween * 12;
                      // }

                      // console.log(
                      //   "modulo",
                      //   columnIndex,
                      //   //imageIndex,
                      //   columnCount,
                      //   columnIndex / (columnCount - 1)
                      // );

                      return (
                        <Box
                          key={rowIndex}
                          pb={
                            rowIndex !== images.length / columnCount - 1
                              ? marginBetween + "px"
                              : 0
                          }
                          pr={
                            //columnIndex / (columnCount - 1) !== 1
                            columnIndex < columnCount - 1
                              ? marginBetween + "px"
                              : 0
                          }
                          pl={
                            //columnIndex / (columnCount - 1) === 1
                            //columnIndex == columnCount ? marginBetween + "px" : 0
                            0
                          }
                        >
                          <Image
                            key={`image-${rowIndex}`}
                            //ref={imageRefs[image.url]}
                            src={image.url}
                            width={`${width}px`}
                            borderRadius="12px"
                            cursor="pointer"
                            //mb={3}
                            // pb={
                            //   rowIndex !== images.length / columnCount - 1
                            //     ? marginBetween + "px"
                            //     : 0
                            // }
                            // pr={
                            //   columnIndex / (columnCount - 1) !== 1
                            //     ? marginBetween + "px"
                            //     : 0
                            // }
                            onClick={() => {
                              onOpen(image);
                            }}
                            // onLoad={() => {
                            //   if (!isLoaded[image.url])
                            //     setIsLoaded({ [image.url]: true });
                            // }}
                          />
                        </Box>
                      );
                    })}
                  </Flex>
                );
              })}
            </Flex>

            {Array.isArray(pages[currentIndex + 1]) && (
              <Button
                onClick={() => {
                  setCurrentIndex(currentIndex + 1);
                }}
              >
                Charger les images suivantes{" "}
                <Badge colorScheme="teal">
                  {stringUtils.bytesForHuman(
                    pages[currentIndex + 1].reduce((sum, cur) => {
                      return sum + cur.bytes;
                    }, 0)
                  )}
                </Badge>
              </Button>
            )}
          </>
        )
      )}

      {position === "bottom" && (
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
                {images[modalState.image.index].url.substring(
                  images[modalState.image.index].url.lastIndexOf("/") + 1
                )}
              </Text>

              <IconButton
                aria-label="Télécharger"
                colorScheme="teal"
                icon={<DownloadIcon />}
                onClick={() => {
                  //const url = `${process.env.NEXT_PUBLIC_FILES}/${entity._id}/${file.url}`;
                }}
              />

              {isGalleryCreator && gallery && (
                <DeleteButton
                  variant="solid"
                  header={
                    <>
                      Êtes vous sûr de vouloir supprimer l'image{" "}
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
                    let payload: {
                      galleryId: string;
                      fileName: string;
                    } = {
                      galleryId: gallery!._id,
                      fileName
                    };

                    try {
                      await api.remove(process.env.NEXT_PUBLIC_API2, payload);
                      toast({
                        title: `L'image a été supprimée !`,
                        status: "success"
                      });
                      setModalState({ isOpen: false });
                      props.onDelete && props.onDelete();
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
    </Column>
  );
};

{
  /*
  #region images loading state
  const imageRefs = useMemo(() => {
    return images.reduce((acc: Record<string, React.RefObject<any>>, value) => {
      acc[value.url] = React.createRef();
      return acc;
    }, {});
  }, [images]);

  const [isLoaded, setIsLoaded] = useState<{ [url: string]: boolean }>({});

  useEffect(() => {
    const newIsLoaded = { ...isLoaded };
    let touched = false;

    Object.keys(imageRefs).map((url) => {
      const imageRef = imageRefs[url];
      const imageEl = imageRef.current;
      if (imageEl && imageEl.complete && !isLoaded[url]) {
        touched = true;
        newIsLoaded[url] = true;
      }
    });

    if (touched) {
      setIsLoaded(newIsLoaded);
    }
  }, [imageRefs]);
  #endregion
*/
}
